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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const service_entity_1 = require("./entities/service.entity");
const slugify_1 = require("slugify");
let ServicesService = class ServicesService {
    constructor(servicesRepository) {
        this.servicesRepository = servicesRepository;
    }
    async create(createServiceDto) {
        const slug = (0, slugify_1.default)(createServiceDto.name, { lower: true, strict: true });
        const existing = await this.servicesRepository.findOne({ where: { slug } });
        if (existing) {
            throw new common_1.ConflictException('Service with this name already exists');
        }
        const service = this.servicesRepository.create({
            ...createServiceDto,
            slug,
        });
        return this.servicesRepository.save(service);
    }
    async findAll() {
        return this.servicesRepository.find({
            where: { isActive: true },
            relations: ['department'],
            order: { order: 'ASC', name: 'ASC' },
        });
    }
    async findOne(id) {
        const service = await this.servicesRepository.findOne({
            where: { id },
            relations: ['department'],
        });
        if (!service) {
            throw new common_1.NotFoundException(`Service with ID ${id} not found`);
        }
        return service;
    }
    async findBySlug(slug) {
        const service = await this.servicesRepository.findOne({
            where: { slug },
            relations: ['department'],
        });
        if (!service) {
            throw new common_1.NotFoundException(`Service with slug ${slug} not found`);
        }
        return service;
    }
    async update(id, updateServiceDto) {
        const service = await this.findOne(id);
        if (updateServiceDto.name && updateServiceDto.name !== service.name) {
            const slug = (0, slugify_1.default)(updateServiceDto.name, { lower: true, strict: true });
            const existing = await this.servicesRepository.findOne({ where: { slug } });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('Service with this name already exists');
            }
            service.slug = slug;
        }
        Object.assign(service, updateServiceDto);
        return this.servicesRepository.save(service);
    }
    async remove(id) {
        const service = await this.findOne(id);
        await this.servicesRepository.remove(service);
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(service_entity_1.Service)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ServicesService);
//# sourceMappingURL=services.service.js.map