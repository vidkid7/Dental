import { Repository } from 'typeorm';
import { BlogPost } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PaginationDto, PaginatedResponseDto } from '@/common/dto/pagination.dto';
export declare class BlogService {
    private blogRepository;
    constructor(blogRepository: Repository<BlogPost>);
    create(createBlogDto: CreateBlogDto): Promise<BlogPost>;
    findAll(paginationDto: PaginationDto & {
        category?: string;
        isPublished?: boolean;
    }): Promise<PaginatedResponseDto<BlogPost>>;
    findOne(id: string): Promise<BlogPost>;
    findBySlug(slug: string): Promise<BlogPost>;
    update(id: string, updateBlogDto: UpdateBlogDto): Promise<BlogPost>;
    publish(id: string): Promise<BlogPost>;
    unpublish(id: string): Promise<BlogPost>;
    remove(id: string): Promise<void>;
    getCategories(): Promise<string[]>;
}
