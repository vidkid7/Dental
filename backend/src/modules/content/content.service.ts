import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageContent } from './entities/content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(PageContent)
    private contentRepository: Repository<PageContent>,
  ) {}

  async create(createContentDto: CreateContentDto): Promise<PageContent> {
    const content = this.contentRepository.create(createContentDto);
    return this.contentRepository.save(content);
  }

  async findByPage(pageSlug: string): Promise<PageContent[]> {
    return this.contentRepository.find({
      where: { pageSlug },
      order: { sectionKey: 'ASC' },
    });
  }

  async findByPageAndSection(pageSlug: string, sectionKey: string): Promise<PageContent | null> {
    return this.contentRepository.findOne({
      where: { pageSlug, sectionKey },
    });
  }

  async findOne(id: string): Promise<PageContent> {
    const content = await this.contentRepository.findOne({ where: { id } });
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
    return content;
  }

  async upsert(pageSlug: string, sectionKey: string, data: UpdateContentDto): Promise<PageContent> {
    let content = await this.findByPageAndSection(pageSlug, sectionKey);
    
    if (content) {
      Object.assign(content, data);
    } else {
      content = this.contentRepository.create({
        pageSlug,
        sectionKey,
        ...data,
      });
    }
    
    return this.contentRepository.save(content);
  }

  async update(id: string, updateContentDto: UpdateContentDto): Promise<PageContent> {
    const content = await this.findOne(id);
    Object.assign(content, updateContentDto);
    return this.contentRepository.save(content);
  }

  async remove(id: string): Promise<void> {
    const content = await this.findOne(id);
    await this.contentRepository.remove(content);
  }

  async getAllPages(): Promise<string[]> {
    const result = await this.contentRepository
      .createQueryBuilder('content')
      .select('DISTINCT content.pageSlug', 'pageSlug')
      .getRawMany();
    return result.map((r) => r.pageSlug);
  }
}
