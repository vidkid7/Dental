import { BaseEntity } from '@/common/entities/base.entity';
export declare enum ProgramType {
    BDS = "bds",
    MDS = "mds",
    INTERNSHIP = "internship",
    CERTIFICATE = "certificate"
}
export declare class AcademicProgram extends BaseEntity {
    name: string;
    slug: string;
    type: ProgramType;
    duration: string;
    description: string;
    eligibility: string;
    curriculum?: string;
    fees?: string;
    seats?: number;
    image?: string;
    isActive: boolean;
}
