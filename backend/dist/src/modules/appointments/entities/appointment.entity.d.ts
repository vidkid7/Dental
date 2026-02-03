import { BaseEntity } from '@/common/entities/base.entity';
import { Doctor } from '@/modules/doctors/entities/doctor.entity';
export declare enum AppointmentStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    COMPLETED = "completed",
    NO_SHOW = "no_show"
}
export declare class Appointment extends BaseEntity {
    doctorId: string;
    doctor: Doctor;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    date: string;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    notes?: string;
    cancellationReason?: string;
    reminderSent: boolean;
    confirmationSent: boolean;
}
