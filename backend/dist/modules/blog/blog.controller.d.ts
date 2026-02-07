import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    create(createBlogDto: CreateBlogDto): Promise<import("./entities/blog.entity").BlogPost>;
    findAll(paginationDto: PaginationDto, category?: string): Promise<import("@/common/dto/pagination.dto").PaginatedResponseDto<import("./entities/blog.entity").BlogPost>>;
    getCategories(): Promise<string[]>;
    findOne(id: string): Promise<import("./entities/blog.entity").BlogPost>;
    findBySlug(slug: string): Promise<import("./entities/blog.entity").BlogPost>;
    update(id: string, updateBlogDto: UpdateBlogDto): Promise<import("./entities/blog.entity").BlogPost>;
    publish(id: string): Promise<import("./entities/blog.entity").BlogPost>;
    unpublish(id: string): Promise<import("./entities/blog.entity").BlogPost>;
    remove(id: string): Promise<void>;
}
