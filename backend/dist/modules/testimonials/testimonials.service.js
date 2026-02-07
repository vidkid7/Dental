"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const testimonial_entity_1 = require("./entities/testimonial.entity");
let TestimonialsService = class TestimonialsService {
    constructor(testimonialsRepository) {
        this.testimonialsRepository = testimonialsRepository;
    }
    async create(createTestimonialDto) {
        const testimonial = this.testimonialsRepository.create(createTestimonialDto);
        return this.testimonialsRepository.save(testimonial);
    }
    async findAll() {
        return this.testimonialsRepository.find({
            where: { isActive: true },
            order: { order: 'ASC', createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const testimonial = await this.testimonialsRepository.findOne({ where: { id } });
        if (!testimonial) {
            throw new common_1.NotFoundException(`Testimonial with ID ${id} not found`);
        }
        return testimonial;
    }
    async update(id, updateTestimonialDto) {
        const testimonial = await this.findOne(id);
        Object.assign(testimonial, updateTestimonialDto);
        return this.testimonialsRepository.save(testimonial);
    }
    async remove(id) {
        const testimonial = await this.findOne(id);
        await this.testimonialsRepository.remove(testimonial);
    }
};
exports.TestimonialsService = TestimonialsService;
exports.TestimonialsService = TestimonialsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(testimonial_entity_1.Testimonial)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TestimonialsService);
//# sourceMappingURL=testimonials.service.js.map