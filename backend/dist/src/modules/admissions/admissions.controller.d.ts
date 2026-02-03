import { AdmissionsService } from './admissions.service';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { UpdateAdmissionDto } from './dto/update-admission.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { ApplicationStatus } from './entities/admission.entity';
export declare class AdmissionsController {
    private readonly admissionsService;
    constructor(admissionsService: AdmissionsService);
    create(createAdmissionDto: CreateAdmissionDto): Promise<import("./entities/admission.entity").AdmissionApplication>;
    findAll(paginationDto: PaginationDto, status?: ApplicationStatus, programId?: string): Promise<import("@/common/dto/pagination.dto").PaginatedResponseDto<import("./entities/admission.entity").AdmissionApplication>>;
    findOne(id: string): Promise<import("./entities/admission.entity").AdmissionApplication>;
    track(applicationNumber: string): Promise<import("./entities/admission.entity").AdmissionApplication>;
    update(id: string, updateAdmissionDto: UpdateAdmissionDto): Promise<import("./entities/admission.entity").AdmissionApplication>;
    submit(id: string): Promise<import("./entities/admission.entity").AdmissionApplication>;
    updateStatus(id: string, updateStatusDto: UpdateStatusDto): Promise<import("./entities/admission.entity").AdmissionApplication>;
    addDocument(id: string, document: {
        type: string;
        name: string;
        url: string;
    }): Promise<import("./entities/admission.entity").AdmissionApplication>;
    remove(id: string): Promise<void>;
}
