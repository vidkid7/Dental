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
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const content_entity_1 = require("./entities/content.entity");
let ContentService = class ContentService {
    constructor(contentRepository) {
        this.contentRepository = contentRepository;
    }
    async create(createContentDto) {
        const content = this.contentRepository.create(createContentDto);
        return this.contentRepository.save(content);
    }
    async findByPage(pageSlug) {
        return this.contentRepository.find({
            where: { pageSlug },
            order: { sectionKey: 'ASC' },
        });
    }
    async findByPageAndSection(pageSlug, sectionKey) {
        return this.contentRepository.findOne({
            where: { pageSlug, sectionKey },
        });
    }
    async findOne(id) {
        const content = await this.contentRepository.findOne({ where: { id } });
        if (!content) {
            throw new common_1.NotFoundException(`Content with ID ${id} not found`);
        }
        return content;
    }
    async upsert(pageSlug, sectionKey, data) {
        let content = await this.findByPageAndSection(pageSlug, sectionKey);
        if (content) {
            Object.assign(content, data);
        }
        else {
            content = this.contentRepository.create({
                pageSlug,
                sectionKey,
                ...data,
            });
        }
        return this.contentRepository.save(content);
    }
    async update(id, updateContentDto) {
        const content = await this.findOne(id);
        Object.assign(content, updateContentDto);
        return this.contentRepository.save(content);
    }
    async remove(id) {
        const content = await this.findOne(id);
        await this.contentRepository.remove(content);
    }
    async getAllPages() {
        const result = await this.contentRepository
            .createQueryBuilder('content')
            .select('DISTINCT content.pageSlug', 'pageSlug')
            .getRawMany();
        return result.map((r) => r.pageSlug);
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(content_entity_1.PageContent)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ContentService);
//# sourceMappingURL=content.service.js.map