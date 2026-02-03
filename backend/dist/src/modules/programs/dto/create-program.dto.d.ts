import { ProgramType } from '../entities/program.entity';
export declare class CreateProgramDto {
    name: string;
    type: ProgramType;
    duration: string;
    description: string;
    eligibility: string;
    curriculum?: string;
    fees?: string;
    seats?: number;
    image?: string;
    isActive?: boolean;
}
