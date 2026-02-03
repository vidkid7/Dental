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
exports.AdmissionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bull_1 = require("@nestjs/bull");
const admission_entity_1 = require("./entities/admission.entity");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const date_fns_1 = require("date-fns");
let AdmissionsService = class AdmissionsService {
    constructor(admissionsRepository, notificationsQueue) {
        this.admissionsRepository = admissionsRepository;
        this.notificationsQueue = notificationsQueue;
    }
    async create(createAdmissionDto) {
        const year = (0, date_fns_1.format)(new Date(), 'yyyy');
        const count = await this.admissionsRepository.count();
        const applicationNumber = `PDC-${year}-${String(count + 1).padStart(5, '0')}`;
        const application = this.admissionsRepository.create({
            ...createAdmissionDto,
            applicationNumber,
            status: admission_entity_1.ApplicationStatus.DRAFT,
        });
        return this.admissionsRepository.save(application);
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', status, programId, } = paginationDto;
        const queryBuilder = this.admissionsRepository
            .createQueryBuilder('application')
            .leftJoinAndSelect('application.program', 'program');
        if (status) {
            queryBuilder.andWhere('application.status = :status', { status });
        }
        if (programId) {
            queryBuilder.andWhere('application.programId = :programId', { programId });
        }
        queryBuilder
            .orderBy(`application.${sortBy}`, sortOrder.toUpperCase())
            .skip((page - 1) * limit)
            .take(limit);
        const [applications, total] = await queryBuilder.getManyAndCount();
        return new pagination_dto_1.PaginatedResponseDto(applications, total, page, limit);
    }
    async findOne(id) {
        const application = await this.admissionsRepository.findOne({
            where: { id },
            relations: ['program'],
        });
        if (!application) {
            throw new common_1.NotFoundException(`Application with ID ${id} not found`);
        }
        return application;
    }
    async findByApplicationNumber(applicationNumber) {
        const application = await this.admissionsRepository.findOne({
            where: { applicationNumber },
            relations: ['program'],
        });
        if (!application) {
            throw new common_1.NotFoundException(`Application ${applicationNumber} not found`);
        }
        return application;
    }
    async update(id, updateAdmissionDto) {
        const application = await this.findOne(id);
        Object.assign(application, updateAdmissionDto);
        return this.admissionsRepository.save(application);
    }
    async submit(id) {
        const application = await this.findOne(id);
        application.status = admission_entity_1.ApplicationStatus.SUBMITTED;
        const savedApplication = await this.admissionsRepository.save(application);
        await this.notificationsQueue.add('admission-submitted', {
            applicationId: savedApplication.id,
            applicationNumber: savedApplication.applicationNumber,
            email: savedApplication.email,
            name: `${savedApplication.firstName} ${savedApplication.lastName}`,
        });
        return savedApplication;
    }
    async updateStatus(id, status, remarks) {
        const application = await this.findOne(id);
        application.status = status;
        if (remarks) {
            application.remarks = remarks;
        }
        const savedApplication = await this.admissionsRepository.save(application);
        await this.notificationsQueue.add('admission-status-update', {
            applicationId: savedApplication.id,
            applicationNumber: savedApplication.applicationNumber,
            email: savedApplication.email,
            name: `${savedApplication.firstName} ${savedApplication.lastName}`,
            status,
        });
        return savedApplication;
    }
    async addDocument(id, document) {
        const application = await this.findOne(id);
        application.documents = [
            ...application.documents,
            { ...document, uploadedAt: new Date().toISOString() },
        ];
        return this.admissionsRepository.save(application);
    }
    async remove(id) {
        const application = await this.findOne(id);
        await this.admissionsRepository.remove(application);
    }
};
exports.AdmissionsService = AdmissionsService;
exports.AdmissionsService = AdmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admission_entity_1.AdmissionApplication)),
    __param(1, (0, bull_1.InjectQueue)('notifications')),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object])
], AdmissionsService);
//# sourceMappingURL=admissions.service.js.map