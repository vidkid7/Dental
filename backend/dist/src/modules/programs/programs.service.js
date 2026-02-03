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
exports.ProgramsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const program_entity_1 = require("./entities/program.entity");
const slugify_1 = require("slugify");
let ProgramsService = class ProgramsService {
    constructor(programsRepository) {
        this.programsRepository = programsRepository;
    }
    async create(createProgramDto) {
        const slug = (0, slugify_1.default)(createProgramDto.name, { lower: true, strict: true });
        const existing = await this.programsRepository.findOne({ where: { slug } });
        if (existing) {
            throw new common_1.ConflictException('Program with this name already exists');
        }
        const program = this.programsRepository.create({
            ...createProgramDto,
            slug,
        });
        return this.programsRepository.save(program);
    }
    async findAll(type) {
        const where = { isActive: true };
        if (type) {
            where.type = type;
        }
        return this.programsRepository.find({
            where,
            order: { name: 'ASC' },
        });
    }
    async findOne(id) {
        const program = await this.programsRepository.findOne({ where: { id } });
        if (!program) {
            throw new common_1.NotFoundException(`Program with ID ${id} not found`);
        }
        return program;
    }
    async findBySlug(slug) {
        const program = await this.programsRepository.findOne({ where: { slug } });
        if (!program) {
            throw new common_1.NotFoundException(`Program with slug ${slug} not found`);
        }
        return program;
    }
    async update(id, updateProgramDto) {
        const program = await this.findOne(id);
        if (updateProgramDto.name && updateProgramDto.name !== program.name) {
            const slug = (0, slugify_1.default)(updateProgramDto.name, { lower: true, strict: true });
            const existing = await this.programsRepository.findOne({ where: { slug } });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('Program with this name already exists');
            }
            program.slug = slug;
        }
        Object.assign(program, updateProgramDto);
        return this.programsRepository.save(program);
    }
    async remove(id) {
        const program = await this.findOne(id);
        await this.programsRepository.remove(program);
    }
};
exports.ProgramsService = ProgramsService;
exports.ProgramsService = ProgramsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(program_entity_1.AcademicProgram)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProgramsService);
//# sourceMappingURL=programs.service.js.map