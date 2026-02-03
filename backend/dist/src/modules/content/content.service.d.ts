import { Repository } from 'typeorm';
import { PageContent } from './entities/content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
export declare class ContentService {
    private contentRepository;
    constructor(contentRepository: Repository<PageContent>);
    create(createContentDto: CreateContentDto): Promise<PageContent>;
    findByPage(pageSlug: string): Promise<PageContent[]>;
    findByPageAndSection(pageSlug: string, sectionKey: string): Promise<PageContent | null>;
    findOne(id: string): Promise<PageContent>;
    upsert(pageSlug: string, sectionKey: string, data: UpdateContentDto): Promise<PageContent>;
    update(id: string, updateContentDto: UpdateContentDto): Promise<PageContent>;
    remove(id: string): Promise<void>;
    getAllPages(): Promise<string[]>;
}
