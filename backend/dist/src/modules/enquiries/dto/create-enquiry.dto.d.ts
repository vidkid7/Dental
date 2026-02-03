import { EnquiryType } from '../entities/enquiry.entity';
export declare class CreateEnquiryDto {
    type?: EnquiryType;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}
