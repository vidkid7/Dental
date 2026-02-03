import { MediaService } from './media.service';
import { MediaType } from './entities/media.entity';
import { PaginationDto } from '@/common/dto/pagination.dto';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    findAllPublic(): Promise<import("@/common/dto/pagination.dto").PaginatedResponseDto<import("./entities/media.entity").MediaFile>>;
    uploadFile(file: Express.Multer.File, folder?: string): Promise<import("./entities/media.entity").MediaFile>;
    findAll(paginationDto: PaginationDto, type?: MediaType, folder?: string): Promise<import("@/common/dto/pagination.dto").PaginatedResponseDto<import("./entities/media.entity").MediaFile>>;
    getFolders(): Promise<string[]>;
    findOne(id: string): Promise<import("./entities/media.entity").MediaFile>;
    update(id: string, data: {
        alt?: string;
        caption?: string;
    }): Promise<import("./entities/media.entity").MediaFile>;
    remove(id: string): Promise<void>;
}
