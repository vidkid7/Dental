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
let MediaService = class MediaService {
    constructor(mediaRepository, configService) {
        this.mediaRepository = mediaRepository;
        this.configService = configService;
        this.MAX_IMAGE_SIZE = 5 * 1024 * 1024;
        this.MAX_VIDEO_SIZE = 100 * 1024 * 1024;
        this.uploadPath = path.join(process.cwd(), '..', 'frontend', 'public');
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
        const url = `/${uploadDir}/${filename}`;
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
        try {
            const filePath = path.join(this.uploadPath, file.url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        catch (error) {
            console.error('Failed to delete file from filesystem:', error);
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