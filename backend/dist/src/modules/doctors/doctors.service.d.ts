import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { DoctorAvailability } from './entities/doctor-availability.entity';
import { DoctorLeave } from './entities/doctor-leave.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { PaginationDto, PaginatedResponseDto } from '@/common/dto/pagination.dto';
export declare class DoctorsService {
    private doctorsRepository;
    private availabilityRepository;
    private leaveRepository;
    constructor(doctorsRepository: Repository<Doctor>, availabilityRepository: Repository<DoctorAvailability>, leaveRepository: Repository<DoctorLeave>);
    create(createDoctorDto: CreateDoctorDto): Promise<Doctor>;
    findAll(paginationDto: PaginationDto & {
        departmentId?: string;
    }): Promise<PaginatedResponseDto<Doctor>>;
    findOne(id: string): Promise<Doctor>;
    update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor>;
    remove(id: string): Promise<void>;
    setAvailability(doctorId: string, availabilityDto: CreateAvailabilityDto): Promise<DoctorAvailability>;
    getAvailabilities(doctorId: string): Promise<DoctorAvailability[]>;
    removeAvailability(doctorId: string, availabilityId: string): Promise<void>;
    addLeave(doctorId: string, leaveDto: CreateLeaveDto): Promise<DoctorLeave>;
    getLeaves(doctorId: string): Promise<DoctorLeave[]>;
    removeLeave(doctorId: string, leaveId: string): Promise<void>;
    getAvailableSlots(doctorId: string, date: string): Promise<{
        startTime: string;
        endTime: string;
    }[]>;
    getMergedAvailableSlotsForDate(date: string): Promise<string[]>;
}
