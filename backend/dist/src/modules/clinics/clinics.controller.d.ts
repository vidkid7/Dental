import { ClinicsService } from './clinics.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
export declare class ClinicsController {
    private readonly clinicsService;
    constructor(clinicsService: ClinicsService);
    create(createClinicDto: CreateClinicDto): Promise<import("./entities/clinic.entity").Clinic>;
    findAll(): Promise<import("./entities/clinic.entity").Clinic[]>;
    getMainClinic(): Promise<import("./entities/clinic.entity").Clinic | null>;
    findOne(id: string): Promise<import("./entities/clinic.entity").Clinic>;
    findBySlug(slug: string): Promise<import("./entities/clinic.entity").Clinic>;
    update(id: string, updateClinicDto: UpdateClinicDto): Promise<import("./entities/clinic.entity").Clinic>;
    remove(id: string): Promise<void>;
}
