import { Repository } from 'typeorm';
import { Testimonial } from './entities/testimonial.entity';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
export declare class TestimonialsService {
    private testimonialsRepository;
    constructor(testimonialsRepository: Repository<Testimonial>);
    create(createTestimonialDto: CreateTestimonialDto): Promise<Testimonial>;
    findAll(): Promise<Testimonial[]>;
    findOne(id: string): Promise<Testimonial>;
    update(id: string, updateTestimonialDto: UpdateTestimonialDto): Promise<Testimonial>;
    remove(id: string): Promise<void>;
}
