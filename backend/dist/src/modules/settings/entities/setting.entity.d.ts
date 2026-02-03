import { BaseEntity } from '@/common/entities/base.entity';
export declare class Setting extends BaseEntity {
    key: string;
    value: string;
    category?: string;
    description?: string;
}
