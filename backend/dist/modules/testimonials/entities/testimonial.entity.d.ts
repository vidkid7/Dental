import { BaseEntity } from '@/common/entities/base.entity';
export declare class Testimonial extends BaseEntity {
    name: string;
    role: string;
    content: string;
    rating: number;
    photo?: string;
    isActive: boolean;
    order: number;
}
