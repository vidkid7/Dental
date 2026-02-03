import { BaseEntity } from '@/common/entities/base.entity';
import { Doctor } from './doctor.entity';
export declare class DoctorLeave extends BaseEntity {
    doctorId: string;
    doctor: Doctor;
    startDate: string;
    endDate: string;
    reason?: string;
}
