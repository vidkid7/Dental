import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/users/entities/user.entity';
export declare class BlogPost extends BaseEntity {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage?: string;
    author: string;
    authorId?: string;
    authorUser?: User;
    category: string;
    tags: string[];
    isPublished: boolean;
    publishedAt?: Date;
    views: number;
    readingTime: number;
}
