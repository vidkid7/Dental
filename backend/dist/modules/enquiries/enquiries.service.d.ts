import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { Enquiry, EnquiryStatus, EnquiryType } from './entities/enquiry.entity';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { PaginationDto, PaginatedResponseDto } from '@/common/dto/pagination.dto';
export declare class EnquiriesService {
    private enquiriesRepository;
    private notificationsQueue;
    constructor(enquiriesRepository: Repository<Enquiry>, notificationsQueue: Queue);
    create(createEnquiryDto: CreateEnquiryDto): Promise<Enquiry>;
    findAll(paginationDto: PaginationDto & {
        type?: EnquiryType;
        status?: EnquiryStatus;
    }): Promise<PaginatedResponseDto<Enquiry>>;
    findOne(id: string): Promise<Enquiry>;
    update(id: string, updateEnquiryDto: UpdateEnquiryDto): Promise<Enquiry>;
    respond(id: string, response: string): Promise<Enquiry>;
    assignTo(id: string, userId: string): Promise<Enquiry>;
    close(id: string): Promise<Enquiry>;
    remove(id: string): Promise<void>;
    getStats(): Promise<{
        total: number;
        new: number;
        inProgress: number;
        resolved: number;
        byType: Record<string, number>;
    }>;
}
