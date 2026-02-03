import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { EnquiryType, EnquiryStatus } from './entities/enquiry.entity';
export declare class EnquiriesController {
    private readonly enquiriesService;
    constructor(enquiriesService: EnquiriesService);
    create(createEnquiryDto: CreateEnquiryDto): Promise<import("./entities/enquiry.entity").Enquiry>;
    findAll(paginationDto: PaginationDto, type?: EnquiryType, status?: EnquiryStatus): Promise<import("@/common/dto/pagination.dto").PaginatedResponseDto<import("./entities/enquiry.entity").Enquiry>>;
    getStats(): Promise<{
        total: number;
        new: number;
        inProgress: number;
        resolved: number;
        byType: Record<string, number>;
    }>;
    findOne(id: string): Promise<import("./entities/enquiry.entity").Enquiry>;
    update(id: string, updateEnquiryDto: UpdateEnquiryDto): Promise<import("./entities/enquiry.entity").Enquiry>;
    respond(id: string, response: string): Promise<import("./entities/enquiry.entity").Enquiry>;
    assignTo(id: string, userId: string): Promise<import("./entities/enquiry.entity").Enquiry>;
    close(id: string): Promise<import("./entities/enquiry.entity").Enquiry>;
    remove(id: string): Promise<void>;
}
