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
exports.ClinicsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const clinic_entity_1 = require("./entities/clinic.entity");
const slugify_1 = require("slugify");
let ClinicsService = class ClinicsService {
    constructor(clinicsRepository) {
        this.clinicsRepository = clinicsRepository;
    }
    async create(createClinicDto) {
        const slug = (0, slugify_1.default)(createClinicDto.name, { lower: true, strict: true });
        const existing = await this.clinicsRepository.findOne({ where: { slug } });
        if (existing) {
            throw new common_1.ConflictException('Clinic with this name already exists');
        }
        const clinic = this.clinicsRepository.create({
            ...createClinicDto,
            slug,
        });
        return this.clinicsRepository.save(clinic);
    }
    async findAll() {
        return this.clinicsRepository.find({
            where: { isActive: true },
            order: { isMain: 'DESC', name: 'ASC' },
        });
    }
    async findOne(id) {
        const clinic = await this.clinicsRepository.findOne({ where: { id } });
        if (!clinic) {
            throw new common_1.NotFoundException(`Clinic with ID ${id} not found`);
        }
        return clinic;
    }
    async findBySlug(slug) {
        const clinic = await this.clinicsRepository.findOne({ where: { slug } });
        if (!clinic) {
            throw new common_1.NotFoundException(`Clinic with slug ${slug} not found`);
        }
        return clinic;
    }
    async update(id, updateClinicDto) {
        const clinic = await this.findOne(id);
        if (updateClinicDto.name && updateClinicDto.name !== clinic.name) {
            const slug = (0, slugify_1.default)(updateClinicDto.name, { lower: true, strict: true });
            const existing = await this.clinicsRepository.findOne({ where: { slug } });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('Clinic with this name already exists');
            }
            clinic.slug = slug;
        }
        Object.assign(clinic, updateClinicDto);
        return this.clinicsRepository.save(clinic);
    }
    async remove(id) {
        const clinic = await this.findOne(id);
        await this.clinicsRepository.remove(clinic);
    }
    async getMainClinic() {
        return this.clinicsRepository.findOne({ where: { isMain: true, isActive: true } });
    }
};
exports.ClinicsService = ClinicsService;
exports.ClinicsService = ClinicsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(clinic_entity_1.Clinic)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClinicsService);
//# sourceMappingURL=clinics.service.js.map