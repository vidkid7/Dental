import { BaseEntity } from '@/common/entities/base.entity';
import { AcademicProgram } from '@/modules/programs/entities/program.entity';
export declare enum ApplicationStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    UNDER_REVIEW = "under_review",
    SHORTLISTED = "shortlisted",
    ACCEPTED = "accepted",
    REJECTED = "rejected"
}
export declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}
export declare class AdmissionApplication extends BaseEntity {
    applicationNumber: string;
    programId: string;
    program: AcademicProgram;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: Gender;
    nationality: string;
    address: string;
    previousEducation: string;
    percentage: number;
    passingYear: number;
    documents: {
        type: string;
        name: string;
        url: string;
        uploadedAt: string;
    }[];
    status: ApplicationStatus;
    remarks?: string;
}
