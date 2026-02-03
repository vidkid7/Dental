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
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const blog_entity_1 = require("./entities/blog.entity");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const slugify_1 = require("slugify");
let BlogService = class BlogService {
    constructor(blogRepository) {
        this.blogRepository = blogRepository;
    }
    async create(createBlogDto) {
        const slug = (0, slugify_1.default)(createBlogDto.title, { lower: true, strict: true });
        const existing = await this.blogRepository.findOne({ where: { slug } });
        if (existing) {
            throw new common_1.ConflictException('Blog post with this title already exists');
        }
        const wordCount = createBlogDto.content.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200);
        const post = this.blogRepository.create({
            ...createBlogDto,
            slug,
            readingTime,
        });
        return this.blogRepository.save(post);
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10, sortBy = 'publishedAt', sortOrder = 'desc', search, category, isPublished = true, } = paginationDto;
        const queryBuilder = this.blogRepository.createQueryBuilder('post');
        if (isPublished) {
            queryBuilder.andWhere('post.isPublished = :isPublished', { isPublished: true });
        }
        if (search) {
            queryBuilder.andWhere('(post.title ILIKE :search OR post.excerpt ILIKE :search)', { search: `%${search}%` });
        }
        if (category) {
            queryBuilder.andWhere('post.category = :category', { category });
        }
        queryBuilder
            .orderBy(`post.${sortBy}`, sortOrder.toUpperCase())
            .skip((page - 1) * limit)
            .take(limit);
        const [posts, total] = await queryBuilder.getManyAndCount();
        return new pagination_dto_1.PaginatedResponseDto(posts, total, page, limit);
    }
    async findOne(id) {
        const post = await this.blogRepository.findOne({ where: { id } });
        if (!post) {
            throw new common_1.NotFoundException(`Blog post with ID ${id} not found`);
        }
        return post;
    }
    async findBySlug(slug) {
        const post = await this.blogRepository.findOne({ where: { slug } });
        if (!post) {
            throw new common_1.NotFoundException(`Blog post with slug ${slug} not found`);
        }
        post.views += 1;
        await this.blogRepository.save(post);
        return post;
    }
    async update(id, updateBlogDto) {
        const post = await this.findOne(id);
        if (updateBlogDto.title && updateBlogDto.title !== post.title) {
            const slug = (0, slugify_1.default)(updateBlogDto.title, { lower: true, strict: true });
            const existing = await this.blogRepository.findOne({ where: { slug } });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('Blog post with this title already exists');
            }
            post.slug = slug;
        }
        if (updateBlogDto.content) {
            const wordCount = updateBlogDto.content.split(/\s+/).length;
            post.readingTime = Math.ceil(wordCount / 200);
        }
        Object.assign(post, updateBlogDto);
        return this.blogRepository.save(post);
    }
    async publish(id) {
        const post = await this.findOne(id);
        post.isPublished = true;
        post.publishedAt = new Date();
        return this.blogRepository.save(post);
    }
    async unpublish(id) {
        const post = await this.findOne(id);
        post.isPublished = false;
        return this.blogRepository.save(post);
    }
    async remove(id) {
        const post = await this.findOne(id);
        await this.blogRepository.remove(post);
    }
    async getCategories() {
        const result = await this.blogRepository
            .createQueryBuilder('post')
            .select('DISTINCT post.category', 'category')
            .where('post.isPublished = true')
            .getRawMany();
        return result.map((r) => r.category);
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(blog_entity_1.BlogPost)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BlogService);
//# sourceMappingURL=blog.service.js.map