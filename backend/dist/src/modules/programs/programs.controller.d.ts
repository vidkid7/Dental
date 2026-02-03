import { ProgramsService } from './programs.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { ProgramType } from './entities/program.entity';
export declare class ProgramsController {
    private readonly programsService;
    constructor(programsService: ProgramsService);
    create(createProgramDto: CreateProgramDto): Promise<import("./entities/program.entity").AcademicProgram>;
    findAll(type?: ProgramType): Promise<import("./entities/program.entity").AcademicProgram[]>;
    findOne(id: string): Promise<import("./entities/program.entity").AcademicProgram>;
    findBySlug(slug: string): Promise<import("./entities/program.entity").AcademicProgram>;
    update(id: string, updateProgramDto: UpdateProgramDto): Promise<import("./entities/program.entity").AcademicProgram>;
    remove(id: string): Promise<void>;
}
