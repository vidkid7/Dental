import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { AppointmentStatus } from './entities/appointment.entity';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(createAppointmentDto: CreateAppointmentDto): Promise<import("./entities/appointment.entity").Appointment>;
    getAvailableDoctors(date: string, time: string): Promise<import("../doctors/entities/doctor.entity").Doctor[]>;
    findAll(paginationDto: PaginationDto, doctorId?: string, status?: AppointmentStatus, startDate?: string, endDate?: string): Promise<import("@/common/dto/pagination.dto").PaginatedResponseDto<import("./entities/appointment.entity").Appointment>>;
    getTodayAppointments(): Promise<import("./entities/appointment.entity").Appointment[]>;
    findOne(id: string): Promise<import("./entities/appointment.entity").Appointment>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<import("./entities/appointment.entity").Appointment>;
    confirm(id: string): Promise<import("./entities/appointment.entity").Appointment>;
    cancel(id: string, reason?: string): Promise<import("./entities/appointment.entity").Appointment>;
    complete(id: string): Promise<import("./entities/appointment.entity").Appointment>;
    markNoShow(id: string): Promise<import("./entities/appointment.entity").Appointment>;
}
