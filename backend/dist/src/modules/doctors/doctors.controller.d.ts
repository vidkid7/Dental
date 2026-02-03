import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
export declare class DoctorsController {
    private readonly doctorsService;
    constructor(doctorsService: DoctorsService);
    create(createDoctorDto: CreateDoctorDto): Promise<import("./entities/doctor.entity").Doctor>;
    getMergedAvailableSlots(date: string): never[] | Promise<string[]>;
    findAll(paginationDto: PaginationDto, departmentId?: string): Promise<import("@/common/dto/pagination.dto").PaginatedResponseDto<import("./entities/doctor.entity").Doctor>>;
    findOne(id: string): Promise<import("./entities/doctor.entity").Doctor>;
    update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<import("./entities/doctor.entity").Doctor>;
    remove(id: string): Promise<void>;
    getAvailabilities(id: string): Promise<import("./entities/doctor-availability.entity").DoctorAvailability[]>;
    setAvailability(id: string, availabilityDto: CreateAvailabilityDto): Promise<import("./entities/doctor-availability.entity").DoctorAvailability>;
    removeAvailability(id: string, availabilityId: string): Promise<void>;
    getLeaves(id: string): Promise<import("./entities/doctor-leave.entity").DoctorLeave[]>;
    addLeave(id: string, leaveDto: CreateLeaveDto): Promise<import("./entities/doctor-leave.entity").DoctorLeave>;
    removeLeave(id: string, leaveId: string): Promise<void>;
    getAvailableSlots(id: string, date: string): Promise<{
        startTime: string;
        endTime: string;
    }[]>;
}
