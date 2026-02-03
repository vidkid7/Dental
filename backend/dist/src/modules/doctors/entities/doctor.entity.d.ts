import { BaseEntity } from '@/common/entities/base.entity';
import { Department } from '@/modules/departments/entities/department.entity';
import { DoctorAvailability } from './doctor-availability.entity';
import { DoctorLeave } from './doctor-leave.entity';
import { Appointment } from '@/modules/appointments/entities/appointment.entity';
import { User } from '@/modules/users/entities/user.entity';
export declare class Doctor extends BaseEntity {
    userId?: string;
    user?: User;
    name: string;
    email: string;
    phone: string;
    photo?: string;
    qualification: string;
    specialization: string;
    departmentId: string;
    department: Department;
    experience: number;
    consultationFee?: number;
    bio?: string;
    isActive: boolean;
    availabilities: DoctorAvailability[];
    leaves: DoctorLeave[];
    appointments: Appointment[];
}
