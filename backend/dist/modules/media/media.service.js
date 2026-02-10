"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const fs = require("fs");
const path = require("path");
const media_entity_1 = require("./entities/media.entity");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const cloudinary_1 = require("cloudinary");
let MediaService = class MediaService {
    constructor(mediaRepository, configService) {
        this.mediaRepository = mediaRepository;
        this.configService = configService;
        this.MAX_IMAGE_SIZE = 5 * 1024 * 1024;
        this.MAX_VIDEO_SIZE = 100 * 1024 * 1024;
        this.uploadPath = path.join(process.cwd(), '..', 'frontend', 'public');
        const cloudName = this.configService.get('CLOUDINARY_CLOUD_NAME');
        const apiKey = this.configService.get('CLOUDINARY_API_KEY');
        const apiSecret = this.configService.get('CLOUDINARY_API_SECRET');
        this.useCloudinary = !!(cloudName && apiKey && apiSecret);
        if (this.useCloudinary) {
            cloudinary_1.v2.config({
                cloud_name: cloudName,
                api_key: apiKey,
                api_secret: apiSecret,
            });
            console.log('✅ Media service configured with Cloudinary (Cloud Storage)');
        }
        else {
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
    async uploadFile(file, folder = 'general') {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        let mediaType;
        let uploadDir;
        if (file.mimetype.startsWith('image/')) {
            mediaType = media_entity_1.MediaType.IMAGE;
            uploadDir = 'images';
            if (file.size > this.MAX_IMAGE_SIZE) {
                throw new common_1.BadRequestException(`Image size exceeds maximum limit of ${this.MAX_IMAGE_SIZE / (1024 * 1024)}MB`);
            }
        }
        else if (file.mimetype.startsWith('video/')) {
            mediaType = media_entity_1.MediaType.VIDEO;
            uploadDir = 'video';
            if (file.size > this.MAX_VIDEO_SIZE) {
                throw new common_1.BadRequestException(`Video size exceeds maximum limit of ${this.MAX_VIDEO_SIZE / (1024 * 1024)}MB`);
            }
        }
        else {
            mediaType = media_entity_1.MediaType.DOCUMENT;
            uploadDir = 'images';
        }
        let url;
        let publicId;
        if (this.useCloudinary) {
            try {
                const uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                        folder: `dental-hospital/${uploadDir}/${folder}`,
                        resource_type: mediaType === media_entity_1.MediaType.VIDEO ? 'video' : 'image',
                        public_id: `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
                    }, (error, result) => {
                        if (error)
                            reject(error);
                        else
                            resolve(result);
                    });
                    uploadStream.end(file.buffer);
                });
                url = uploadResult.secure_url;
                publicId = uploadResult.public_id;
                console.log(`✅ Uploaded ${mediaType} to Cloudinary: ${publicId}`);
            }
            catch (error) {
                console.error('Cloudinary upload failed:', error);
                throw new common_1.BadRequestException('Failed to upload file to cloud storage');
            }
        }
        else {
            const timestamp = Date.now();
            const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
            const filename = `${timestamp}-${sanitizedName}`;
            const filePath = path.join(this.uploadPath, uploadDir, filename);
            try {
                fs.writeFileSync(filePath, file.buffer);
            }
            catch (error) {
                console.error('Failed to save file:', error);
                throw new common_1.BadRequestException('Failed to save file to disk');
            }
            url = `/${uploadDir}/${filename}`;
            publicId = filename;
        }
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
    async findAll(paginationDto) {
        const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', type, folder, } = paginationDto;
        const queryBuilder = this.mediaRepository.createQueryBuilder('media');
        if (type) {
            queryBuilder.andWhere('media.type = :type', { type });
        }
        if (folder) {
            queryBuilder.andWhere('media.folder = :folder', { folder });
        }
        queryBuilder
            .orderBy(`media.${sortBy}`, sortOrder.toUpperCase())
            .skip((page - 1) * limit)
            .take(limit);
        const [files, total] = await queryBuilder.getManyAndCount();
        return new pagination_dto_1.PaginatedResponseDto(files, total, page, limit);
    }
    async findOne(id) {
        const file = await this.mediaRepository.findOne({ where: { id } });
        if (!file) {
            throw new common_1.NotFoundException(`Media file with ID ${id} not found`);
        }
        return file;
    }
    async update(id, data) {
        const file = await this.findOne(id);
        Object.assign(file, data);
        return this.mediaRepository.save(file);
    }
    async remove(id) {
        const file = await this.findOne(id);
        if (this.useCloudinary) {
            try {
                await cloudinary_1.v2.uploader.destroy(file.publicId, {
                    resource_type: file.type === media_entity_1.MediaType.VIDEO ? 'video' : 'image',
                });
                console.log(`✅ Deleted from Cloudinary: ${file.publicId}`);
            }
            catch (error) {
                console.error('Failed to delete file from Cloudinary:', error);
            }
        }
        else {
            try {
                const filePath = path.join(this.uploadPath, file.url);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            catch (error) {
                console.error('Failed to delete file from filesystem:', error);
            }
        }
        await this.mediaRepository.remove(file);
    }
    async getFolders() {
        const result = await this.mediaRepository
            .createQueryBuilder('media')
            .select('DISTINCT media.folder', 'folder')
            .where('media.folder IS NOT NULL')
            .getRawMany();
        return result.map((r) => r.folder);
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(media_entity_1.MediaFile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], MediaService);
//# sourceMappingURL=media.service.js.map