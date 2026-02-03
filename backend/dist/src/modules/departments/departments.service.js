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
var DepartmentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const department_entity_1 = require("./entities/department.entity");
const slugify_1 = require("slugify");
let DepartmentsService = DepartmentsService_1 = class DepartmentsService {
    constructor(departmentsRepository) {
        this.departmentsRepository = departmentsRepository;
        this.logger = new common_1.Logger(DepartmentsService_1.name);
    }
    async onModuleInit() {
        const count = await this.departmentsRepository.count();
        if (count > 0) {
            return;
        }
        this.logger.log('No departments found. Seeding default departments...');
        const defaults = [
            {
                name: 'General Dentistry',
                description: 'Comprehensive dental care including preventive and restorative treatments',
                isActive: true,
                order: 1,
            },
            {
                name: 'Orthodontics',
                description: 'Correction of teeth and jaw alignment using braces and aligners',
                isActive: true,
                order: 2,
            },
            {
                name: 'Oral & Maxillofacial Surgery',
                description: 'Surgical procedures for the mouth, jaw, and face',
                isActive: true,
                order: 3,
            },
            {
                name: 'Pediatric Dentistry',
                description: 'Specialized dental care for children and adolescents',
                isActive: true,
                order: 4,
            },
        ];
        for (const dept of defaults) {
            const slug = (0, slugify_1.default)(dept.name, { lower: true, strict: true });
            const existing = await this.departmentsRepository.findOne({ where: { slug } });
            if (!existing) {
                const entity = this.departmentsRepository.create({
                    ...dept,
                    slug,
                });
                await this.departmentsRepository.save(entity);
            }
        }
        this.logger.log('Default departments seeded.');
    }
    async create(createDepartmentDto) {
        const slug = (0, slugify_1.default)(createDepartmentDto.name, { lower: true, strict: true });
        const existing = await this.departmentsRepository.findOne({ where: { slug } });
        if (existing) {
            throw new common_1.ConflictException('Department with this name already exists');
        }
        const department = this.departmentsRepository.create({
            ...createDepartmentDto,
            slug,
        });
        return this.departmentsRepository.save(department);
    }
    async findAll() {
        return this.departmentsRepository.find({
            where: { isActive: true },
            order: { order: 'ASC', name: 'ASC' },
        });
    }
    async findOne(id) {
        const department = await this.departmentsRepository.findOne({
            where: { id },
            relations: ['doctors', 'services'],
        });
        if (!department) {
            throw new common_1.NotFoundException(`Department with ID ${id} not found`);
        }
        return department;
    }
    async findBySlug(slug) {
        const department = await this.departmentsRepository.findOne({
            where: { slug },
            relations: ['doctors', 'services'],
        });
        if (!department) {
            throw new common_1.NotFoundException(`Department with slug ${slug} not found`);
        }
        return department;
    }
    async update(id, updateDepartmentDto) {
        const department = await this.findOne(id);
        if (updateDepartmentDto.name && updateDepartmentDto.name !== department.name) {
            const slug = (0, slugify_1.default)(updateDepartmentDto.name, { lower: true, strict: true });
            const existing = await this.departmentsRepository.findOne({ where: { slug } });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('Department with this name already exists');
            }
            department.slug = slug;
        }
        Object.assign(department, updateDepartmentDto);
        return this.departmentsRepository.save(department);
    }
    async remove(id) {
        const department = await this.findOne(id);
        await this.departmentsRepository.remove(department);
    }
};
exports.DepartmentsService = DepartmentsService;
exports.DepartmentsService = DepartmentsService = DepartmentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DepartmentsService);
//# sourceMappingURL=departments.service.js.map