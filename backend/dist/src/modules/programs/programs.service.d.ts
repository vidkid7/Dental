import { Repository } from 'typeorm';
import { AcademicProgram, ProgramType } from './entities/program.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
export declare class ProgramsService {
    private programsRepository;
    constructor(programsRepository: Repository<AcademicProgram>);
    create(createProgramDto: CreateProgramDto): Promise<AcademicProgram>;
    findAll(type?: ProgramType): Promise<AcademicProgram[]>;
    findOne(id: string): Promise<AcademicProgram>;
    findBySlug(slug: string): Promise<AcademicProgram>;
    update(id: string, updateProgramDto: UpdateProgramDto): Promise<AcademicProgram>;
    remove(id: string): Promise<void>;
}
