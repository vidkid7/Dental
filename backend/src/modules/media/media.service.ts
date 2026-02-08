import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { MediaFile, MediaType } from './entities/media.entity';
import { PaginationDto, PaginatedResponseDto } from '@/common/dto/pagination.dto';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class MediaService {
  private readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
  private readonly uploadPath = path.join(process.cwd(), '..', 'frontend', 'public');
  private readonly useCloudinary: boolean;

  constructor(
    @InjectRepository(MediaFile)
    private mediaRepository: Repository<MediaFile>,
    private configService: ConfigService,
  ) {
    // Configure Cloudinary if credentials are available
    const cloudName = this.configService.get('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get('CLOUDINARY_API_SECRET');
    
    this.useCloudinary = !!(cloudName && apiKey && apiSecret);
    
    if (this.useCloudinary) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
      console.log('✅ Media service configured with Cloudinary (Cloud Storage)');
    } else {
      // Ensure upload directories exist for local storage
      const imagePath = path.join(this.uploadPath, 'images');
      const videoPath = path.join(this.uploadPath, 'video');
      
      if (!fs.existsSync(imagePath)) {
        fs.mkdirSync(imagePath, { recursive: true });
      }
      if (!fs.existsSync(videoPath)) {
        fs.mkdirSync(videoPath, { recursive: true });
      }

      console.log('✅ Media service configured with Local Storage');
      console.log(`   Images: ${imagePath}`);
      console.log(`   Videos: ${videoPath}`);
    }
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

    let url: string;
    let publicId: string;

    // Upload to Cloudinary if configured, otherwise use local storage
    if (this.useCloudinary) {
      try {
        // Upload to Cloudinary
        const uploadResult = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: `dental-hospital/${uploadDir}/${folder}`,
              resource_type: mediaType === MediaType.VIDEO ? 'video' : 'image',
              public_id: `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(file.buffer);
        });

        url = uploadResult.secure_url;
        publicId = uploadResult.public_id;
        
        console.log(`✅ Uploaded ${mediaType} to Cloudinary: ${publicId}`);
      } catch (error) {
        console.error('Cloudinary upload failed:', error);
        throw new BadRequestException('Failed to upload file to cloud storage');
      }
    } else {
      // Local storage fallback
      const timestamp = Date.now();
      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${timestamp}-${sanitizedName}`;
      const filePath = path.join(this.uploadPath, uploadDir, filename);

      try {
        fs.writeFileSync(filePath, file.buffer);
      } catch (error) {
        console.error('Failed to save file:', error);
        throw new BadRequestException('Failed to save file to disk');
      }

      url = `/${uploadDir}/${filename}`;
      publicId = filename;
    }

    // Save to database
    const mediaFile = this.mediaRepository.create({
      name: file.originalname,
      url,
      publicId,
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
    
    // Delete from storage
    if (this.useCloudinary) {
      try {
        await cloudinary.uploader.destroy(file.publicId, {
          resource_type: file.type === MediaType.VIDEO ? 'video' : 'image',
        });
        console.log(`✅ Deleted from Cloudinary: ${file.publicId}`);
      } catch (error) {
        console.error('Failed to delete file from Cloudinary:', error);
      }
    } else {
      // Delete from local filesystem
      try {
        const filePath = path.join(this.uploadPath, file.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error('Failed to delete file from filesystem:', error);
      }
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
