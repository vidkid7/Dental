import { Repository } from 'typeorm';
import { Clinic } from './entities/clinic.entity';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
export declare class ClinicsService {
    private clinicsRepository;
    constructor(clinicsRepository: Repository<Clinic>);
    create(createClinicDto: CreateClinicDto): Promise<Clinic>;
    findAll(): Promise<Clinic[]>;
    findOne(id: string): Promise<Clinic>;
    findBySlug(slug: string): Promise<Clinic>;
    update(id: string, updateClinicDto: UpdateClinicDto): Promise<Clinic>;
    remove(id: string): Promise<void>;
    getMainClinic(): Promise<Clinic | null>;
}
