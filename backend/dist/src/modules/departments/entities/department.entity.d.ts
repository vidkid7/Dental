import { BaseEntity } from '@/common/entities/base.entity';
import { Doctor } from '@/modules/doctors/entities/doctor.entity';
import { Service } from '@/modules/services/entities/service.entity';
export declare class Department extends BaseEntity {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    image?: string;
    isActive: boolean;
    order: number;
    doctors: Doctor[];
    services: Service[];
}
