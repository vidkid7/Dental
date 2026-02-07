import { Repository } from 'typeorm';
import { Faculty } from './entities/faculty.entity';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
export declare class FacultyService {
    private facultyRepository;
    constructor(facultyRepository: Repository<Faculty>);
    create(createFacultyDto: CreateFacultyDto): Promise<Faculty>;
    findAll(departmentId?: string): Promise<Faculty[]>;
    findOne(id: string): Promise<Faculty>;
    update(id: string, updateFacultyDto: UpdateFacultyDto): Promise<Faculty>;
    remove(id: string): Promise<void>;
}
