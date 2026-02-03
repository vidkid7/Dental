import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/users/entities/user.entity';
export declare enum EnquiryType {
    GENERAL = "general",
    APPOINTMENT = "appointment",
    ADMISSION = "admission",
    SERVICES = "services",
    FEEDBACK = "feedback",
    COMPLAINT = "complaint"
}
export declare enum EnquiryStatus {
    NEW = "new",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved",
    CLOSED = "closed"
}
export declare class Enquiry extends BaseEntity {
    type: EnquiryType;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    status: EnquiryStatus;
    assignedTo?: string;
    assignedUser?: User;
    response?: string;
    respondedAt?: Date;
}
