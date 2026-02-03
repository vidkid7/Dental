import { BaseEntity } from '@/common/entities/base.entity';
import { Department } from '@/modules/departments/entities/department.entity';
export declare class Faculty extends BaseEntity {
    name: string;
    designation: string;
    qualification: string;
    departmentId: string;
    department: Department;
    photo?: string;
    email?: string;
    specialization?: string;
    bio?: string;
    publications?: string[];
    isActive: boolean;
    order: number;
}
