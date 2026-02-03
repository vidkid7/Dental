import { BaseEntity } from '@/common/entities/base.entity';
import { Doctor } from './doctor.entity';
export declare class DoctorAvailability extends BaseEntity {
    doctorId: string;
    doctor: Doctor;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDuration: number;
    isActive: boolean;
}
