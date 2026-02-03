import { Gender } from '../entities/admission.entity';
export declare class CreateAdmissionDto {
    programId: string;
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
}
