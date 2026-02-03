import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { MediaFile, MediaType } from './entities/media.entity';
import { PaginationDto, PaginatedResponseDto } from '@/common/dto/pagination.dto';
export declare class MediaService {
    private mediaRepository;
    private configService;
    private readonly MAX_IMAGE_SIZE;
    private readonly MAX_VIDEO_SIZE;
    private readonly uploadPath;
    constructor(mediaRepository: Repository<MediaFile>, configService: ConfigService);
    uploadFile(file: Express.Multer.File, folder?: string): Promise<MediaFile>;
    findAll(paginationDto: PaginationDto & {
        type?: MediaType;
        folder?: string;
    }): Promise<PaginatedResponseDto<MediaFile>>;
    findOne(id: string): Promise<MediaFile>;
    update(id: string, data: {
        alt?: string;
        caption?: string;
    }): Promise<MediaFile>;
    remove(id: string): Promise<void>;
    getFolders(): Promise<string[]>;
}
