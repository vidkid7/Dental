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
exports.EnquiriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bull_1 = require("@nestjs/bull");
const enquiry_entity_1 = require("./entities/enquiry.entity");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let EnquiriesService = class EnquiriesService {
    constructor(enquiriesRepository, notificationsQueue) {
        this.enquiriesRepository = enquiriesRepository;
        this.notificationsQueue = notificationsQueue;
    }
    async create(createEnquiryDto) {
        const enquiry = this.enquiriesRepository.create(createEnquiryDto);
        const savedEnquiry = await this.enquiriesRepository.save(enquiry);
        await this.notificationsQueue.add('new-enquiry', {
            enquiryId: savedEnquiry.id,
            type: savedEnquiry.type,
            name: savedEnquiry.name,
            email: savedEnquiry.email,
            subject: savedEnquiry.subject,
        });
        return savedEnquiry;
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', type, status, } = paginationDto;
        const queryBuilder = this.enquiriesRepository.createQueryBuilder('enquiry');
        if (type) {
            queryBuilder.andWhere('enquiry.type = :type', { type });
        }
        if (status) {
            queryBuilder.andWhere('enquiry.status = :status', { status });
        }
        queryBuilder
            .orderBy(`enquiry.${sortBy}`, sortOrder.toUpperCase())
            .skip((page - 1) * limit)
            .take(limit);
        const [enquiries, total] = await queryBuilder.getManyAndCount();
        return new pagination_dto_1.PaginatedResponseDto(enquiries, total, page, limit);
    }
    async findOne(id) {
        const enquiry = await this.enquiriesRepository.findOne({
            where: { id },
            relations: ['assignedUser'],
        });
        if (!enquiry) {
            throw new common_1.NotFoundException(`Enquiry with ID ${id} not found`);
        }
        return enquiry;
    }
    async update(id, updateEnquiryDto) {
        const enquiry = await this.findOne(id);
        Object.assign(enquiry, updateEnquiryDto);
        return this.enquiriesRepository.save(enquiry);
    }
    async respond(id, response) {
        const enquiry = await this.findOne(id);
        enquiry.response = response;
        enquiry.respondedAt = new Date();
        enquiry.status = enquiry_entity_1.EnquiryStatus.RESOLVED;
        const savedEnquiry = await this.enquiriesRepository.save(enquiry);
        await this.notificationsQueue.add('enquiry-response', {
            enquiryId: savedEnquiry.id,
            email: savedEnquiry.email,
            name: savedEnquiry.name,
            response,
        });
        return savedEnquiry;
    }
    async assignTo(id, userId) {
        const enquiry = await this.findOne(id);
        enquiry.assignedTo = userId;
        enquiry.status = enquiry_entity_1.EnquiryStatus.IN_PROGRESS;
        return this.enquiriesRepository.save(enquiry);
    }
    async close(id) {
        const enquiry = await this.findOne(id);
        enquiry.status = enquiry_entity_1.EnquiryStatus.CLOSED;
        return this.enquiriesRepository.save(enquiry);
    }
    async remove(id) {
        const enquiry = await this.findOne(id);
        await this.enquiriesRepository.remove(enquiry);
    }
    async getStats() {
        const [total, newCount, inProgress, resolved] = await Promise.all([
            this.enquiriesRepository.count(),
            this.enquiriesRepository.count({ where: { status: enquiry_entity_1.EnquiryStatus.NEW } }),
            this.enquiriesRepository.count({ where: { status: enquiry_entity_1.EnquiryStatus.IN_PROGRESS } }),
            this.enquiriesRepository.count({ where: { status: enquiry_entity_1.EnquiryStatus.RESOLVED } }),
        ]);
        const typeStats = await this.enquiriesRepository
            .createQueryBuilder('enquiry')
            .select('enquiry.type', 'type')
            .addSelect('COUNT(*)', 'count')
            .groupBy('enquiry.type')
            .getRawMany();
        const byType = typeStats.reduce((acc, { type, count }) => {
            acc[type] = parseInt(count);
            return acc;
        }, {});
        return { total, new: newCount, inProgress, resolved, byType };
    }
};
exports.EnquiriesService = EnquiriesService;
exports.EnquiriesService = EnquiriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(enquiry_entity_1.Enquiry)),
    __param(1, (0, bull_1.InjectQueue)('notifications')),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object])
], EnquiriesService);
//# sourceMappingURL=enquiries.service.js.map