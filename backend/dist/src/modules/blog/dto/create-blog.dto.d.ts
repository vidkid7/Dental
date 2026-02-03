export declare class CreateBlogDto {
    title: string;
    excerpt: string;
    content: string;
    featuredImage?: string;
    author: string;
    authorId?: string;
    category: string;
    tags?: string[];
    isPublished?: boolean;
}
