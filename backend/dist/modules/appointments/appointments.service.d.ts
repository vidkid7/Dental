import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PaginationDto, PaginatedResponseDto } from '@/common/dto/pagination.dto';
import { DoctorsService } from '../doctors/doctors.service';
import { Doctor } from '../doctors/entities/doctor.entity';
export declare class AppointmentsService {
    private appointmentsRepository;
    private doctorsService;
    constructor(appointmentsRepository: Repository<Appointment>, doctorsService: DoctorsService);
    create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment>;
    findAll(paginationDto: PaginationDto & {
        doctorId?: string;
        status?: AppointmentStatus;
        startDate?: string;
        endDate?: string;
    }): Promise<PaginatedResponseDto<Appointment>>;
    findOne(id: string): Promise<Appointment>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment>;
    cancel(id: string, reason?: string): Promise<Appointment>;
    confirm(id: string): Promise<Appointment>;
    complete(id: string): Promise<Appointment>;
    markNoShow(id: string): Promise<Appointment>;
    getAppointmentsByDoctor(doctorId: string, date: string): Promise<Appointment[]>;
    getTodayAppointments(): Promise<Appointment[]>;
    getAppointmentsForReminders(): Promise<Appointment[]>;
    markReminderSent(id: string): Promise<void>;
    getAvailableDoctorsAtSlot(date: string, time: string): Promise<Doctor[]>;
}
