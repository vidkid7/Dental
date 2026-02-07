import { BaseEntity } from '@/common/entities/base.entity';
export declare class PageContent extends BaseEntity {
    pageSlug: string;
    sectionKey: string;
    content: Record<string, unknown>;
    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
        ogImage?: string;
        canonicalUrl?: string;
        noIndex?: boolean;
        schema?: Record<string, unknown>;
    };
}
