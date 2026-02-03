import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
export declare class TestimonialsController {
    private readonly testimonialsService;
    constructor(testimonialsService: TestimonialsService);
    create(createTestimonialDto: CreateTestimonialDto): Promise<import("./entities/testimonial.entity").Testimonial>;
    findAll(): Promise<import("./entities/testimonial.entity").Testimonial[]>;
    findOne(id: string): Promise<import("./entities/testimonial.entity").Testimonial>;
    update(id: string, updateTestimonialDto: UpdateTestimonialDto): Promise<import("./entities/testimonial.entity").Testimonial>;
    remove(id: string): Promise<void>;
}
