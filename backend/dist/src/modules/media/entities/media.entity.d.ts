import { BaseEntity } from '@/common/entities/base.entity';
export declare enum MediaType {
    IMAGE = "image",
    VIDEO = "video",
    DOCUMENT = "document"
}
export declare class MediaFile extends BaseEntity {
    name: string;
    url: string;
    publicId: string;
    type: MediaType;
    mimeType: string;
    size: number;
    width?: number;
    height?: number;
    folder?: string;
    alt?: string;
    caption?: string;
}
