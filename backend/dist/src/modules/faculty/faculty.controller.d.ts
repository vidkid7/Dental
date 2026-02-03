import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
export declare class FacultyController {
    private readonly facultyService;
    constructor(facultyService: FacultyService);
    create(createFacultyDto: CreateFacultyDto): Promise<import("./entities/faculty.entity").Faculty>;
    findAll(departmentId?: string): Promise<import("./entities/faculty.entity").Faculty[]>;
    findOne(id: string): Promise<import("./entities/faculty.entity").Faculty>;
    update(id: string, updateFacultyDto: UpdateFacultyDto): Promise<import("./entities/faculty.entity").Faculty>;
    remove(id: string): Promise<void>;
}
