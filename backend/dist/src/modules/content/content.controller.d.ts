import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
export declare class ContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
    create(createContentDto: CreateContentDto): Promise<import("./entities/content.entity").PageContent>;
    getAllPages(): Promise<string[]>;
    findByPage(pageSlug: string): Promise<import("./entities/content.entity").PageContent[]>;
    findByPageAndSection(pageSlug: string, sectionKey: string): Promise<import("./entities/content.entity").PageContent | null>;
    upsert(pageSlug: string, sectionKey: string, updateContentDto: UpdateContentDto): Promise<import("./entities/content.entity").PageContent>;
    findOne(id: string): Promise<import("./entities/content.entity").PageContent>;
    update(id: string, updateContentDto: UpdateContentDto): Promise<import("./entities/content.entity").PageContent>;
    remove(id: string): Promise<void>;
}
