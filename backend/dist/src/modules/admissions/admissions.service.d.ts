import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { AdmissionApplication, ApplicationStatus } from './entities/admission.entity';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { UpdateAdmissionDto } from './dto/update-admission.dto';
import { PaginationDto, PaginatedResponseDto } from '@/common/dto/pagination.dto';
export declare class AdmissionsService {
    private admissionsRepository;
    private notificationsQueue;
    constructor(admissionsRepository: Repository<AdmissionApplication>, notificationsQueue: Queue);
    create(createAdmissionDto: CreateAdmissionDto): Promise<AdmissionApplication>;
    findAll(paginationDto: PaginationDto & {
        status?: ApplicationStatus;
        programId?: string;
    }): Promise<PaginatedResponseDto<AdmissionApplication>>;
    findOne(id: string): Promise<AdmissionApplication>;
    findByApplicationNumber(applicationNumber: string): Promise<AdmissionApplication>;
    update(id: string, updateAdmissionDto: UpdateAdmissionDto): Promise<AdmissionApplication>;
    submit(id: string): Promise<AdmissionApplication>;
    updateStatus(id: string, status: ApplicationStatus, remarks?: string): Promise<AdmissionApplication>;
    addDocument(id: string, document: {
        type: string;
        name: string;
        url: string;
    }): Promise<AdmissionApplication>;
    remove(id: string): Promise<void>;
}
