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
exports.FacultyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const faculty_entity_1 = require("./entities/faculty.entity");
let FacultyService = class FacultyService {
    constructor(facultyRepository) {
        this.facultyRepository = facultyRepository;
    }
    async create(createFacultyDto) {
        const faculty = this.facultyRepository.create(createFacultyDto);
        return this.facultyRepository.save(faculty);
    }
    async findAll(departmentId) {
        const where = { isActive: true };
        if (departmentId) {
            where.departmentId = departmentId;
        }
        return this.facultyRepository.find({
            where,
            relations: ['department'],
            order: { order: 'ASC', name: 'ASC' },
        });
    }
    async findOne(id) {
        const faculty = await this.facultyRepository.findOne({
            where: { id },
            relations: ['department'],
        });
        if (!faculty) {
            throw new common_1.NotFoundException(`Faculty with ID ${id} not found`);
        }
        return faculty;
    }
    async update(id, updateFacultyDto) {
        const faculty = await this.findOne(id);
        Object.assign(faculty, updateFacultyDto);
        return this.facultyRepository.save(faculty);
    }
    async remove(id) {
        const faculty = await this.findOne(id);
        await this.facultyRepository.remove(faculty);
    }
};
exports.FacultyService = FacultyService;
exports.FacultyService = FacultyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(faculty_entity_1.Faculty)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FacultyService);
//# sourceMappingURL=faculty.service.js.map