import { CreateEnquiryDto } from './create-enquiry.dto';
import { EnquiryStatus } from '../entities/enquiry.entity';
declare const UpdateEnquiryDto_base: import("@nestjs/common").Type<Partial<CreateEnquiryDto>>;
export declare class UpdateEnquiryDto extends UpdateEnquiryDto_base {
    status?: EnquiryStatus;
    assignedTo?: string;
    response?: string;
}
export {};
