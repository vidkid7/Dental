import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { MediaFile, MediaType } from './entities/media.entity';
import { PaginationDto, PaginatedResponseDto } from '@/common/dto/pagination.dto';

@Injectable()
export class MediaService {
  private readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
  private readonly uploadPath = path.join(process.cwd(), '..', 'frontend', 'public');

  constructor(
    @InjectRepository(MediaFile)
    private mediaRepository: Repository<MediaFile>,
    private configService: ConfigService,
  ) {
    // Ensure upload directories exist
    const imagePath = path.join(this.uploadPath, 'images');
    const videoPath = path.join(this.uploadPath, 'video');
    
    if (!fs.existsSync(imagePath)) {
      fs.mkdirSync(imagePath, { recursive: true });
    }
    if (!fs.existsSync(videoPath)) {
      fs.mkdirSync(videoPath, { recursive: true });
    }

    console.log('✅ Media upload configured for local storage');
    console.log(`   Images: ${imagePath}`);
    console.log(`   Videos: ${videoPath}`);
  }

  async uploadFile(
    file: Express.Multer.File,
    folder = 'general',
  ): Promise<MediaFile> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Determine media type and validate size
    let mediaType: MediaType;
    let uploadDir: string;
    
    if (file.mimetype.startsWith('image/')) {
      mediaType = MediaType.IMAGE;
      uploadDir = 'images';
      
      if (file.size > this.MAX_IMAGE_SIZE) {
        throw new BadRequestException(
          `Image size exceeds maximum limit of ${this.MAX_IMAGE_SIZE / (1024 * 1024)}MB`
        );
      }
    } else if (file.mimetype.startsWith('video/')) {
      mediaType = MediaType.VIDEO;
      uploadDir = 'video';
      
      if (file.size > this.MAX_VIDEO_SIZE) {
        throw new BadRequestException(
          `Video size exceeds maximum limit of ${this.MAX_VIDEO_SIZE / (1024 * 1024)}MB`
        );
      }
    } else {
      mediaType = MediaType.DOCUMENT;
      uploadDir = 'images'; // fallback to images
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedName}`;
    const filePath = path.join(this.uploadPath, uploadDir, filename);

    // Save file to disk
    try {
      fs.writeFileSync(filePath, file.buffer);
    } catch (error) {
      console.error('Failed to save file:', error);
      throw new BadRequestException('Failed to save file to disk');
    }

    // Create public URL
    const url = `/${uploadDir}/${filename}`;

    // Save to database
    const mediaFile = this.mediaRepository.create({
      name: file.originalname,
      url,
      publicId: filename,
      type: mediaType,
      mimeType: file.mimetype,
      size: file.size,
      folder,
    });

    return this.mediaRepository.save(mediaFile);
  }

  async findAll(
    paginationDto: PaginationDto & { type?: MediaType; folder?: string },
  ): Promise<PaginatedResponseDto<MediaFile>> {
    const { 
      page = 1, 
      limit = 20, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      type,
      folder,
    } = paginationDto;

    const queryBuilder = this.mediaRepository.createQueryBuilder('media');

    if (type) {
      queryBuilder.andWhere('media.type = :type', { type });
    }

    if (folder) {
      queryBuilder.andWhere('media.folder = :folder', { folder });
    }

    queryBuilder
      .orderBy(`media.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [files, total] = await queryBuilder.getManyAndCount();

    return new PaginatedResponseDto(files, total, page, limit);
  }

  async findOne(id: string): Promise<MediaFile> {
    const file = await this.mediaRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException(`Media file with ID ${id} not found`);
    }
    return file;
  }

  async update(
    id: string,
    data: { alt?: string; caption?: string },
  ): Promise<MediaFile> {
    const file = await this.findOne(id);
    Object.assign(file, data);
    return this.mediaRepository.save(file);
  }

  async remove(id: string): Promise<void> {
    const file = await this.findOne(id);
    
    // Delete from filesystem
    try {
      const filePath = path.join(this.uploadPath, file.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Failed to delete file from filesystem:', error);
    }
    
    // Delete from database
    await this.mediaRepository.remove(file);
  }

  async getFolders(): Promise<string[]> {
    const result = await this.mediaRepository
      .createQueryBuilder('media')
      .select('DISTINCT media.folder', 'folder')
      .where('media.folder IS NOT NULL')
      .getRawMany();
    return result.map((r) => r.folder);
  }
}
