import { BaseEntity } from '@/common/entities/base.entity';
import { Department } from '@/modules/departments/entities/department.entity';
export declare class Service extends BaseEntity {
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    icon?: string;
    image?: string;
    gallery?: string[];
    departmentId?: string;
    department?: Department;
    isActive: boolean;
    order: number;
}
