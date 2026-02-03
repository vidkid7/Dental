import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicProgram, ProgramType } from './entities/program.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import slugify from 'slugify';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(AcademicProgram)
    private programsRepository: Repository<AcademicProgram>,
  ) {}

  async create(createProgramDto: CreateProgramDto): Promise<AcademicProgram> {
    const slug = slugify(createProgramDto.name, { lower: true, strict: true });
    
    const existing = await this.programsRepository.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException('Program with this name already exists');
    }

    const program = this.programsRepository.create({
      ...createProgramDto,
      slug,
    });
    return this.programsRepository.save(program);
  }

  async findAll(type?: ProgramType): Promise<AcademicProgram[]> {
    const where: any = { isActive: true };
    if (type) {
      where.type = type;
    }
    return this.programsRepository.find({
      where,
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<AcademicProgram> {
    const program = await this.programsRepository.findOne({ where: { id } });
    if (!program) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }
    return program;
  }

  async findBySlug(slug: string): Promise<AcademicProgram> {
    const program = await this.programsRepository.findOne({ where: { slug } });
    if (!program) {
      throw new NotFoundException(`Program with slug ${slug} not found`);
    }
    return program;
  }

  async update(id: string, updateProgramDto: UpdateProgramDto): Promise<AcademicProgram> {
    const program = await this.findOne(id);
    
    if (updateProgramDto.name && updateProgramDto.name !== program.name) {
      const slug = slugify(updateProgramDto.name, { lower: true, strict: true });
      const existing = await this.programsRepository.findOne({ where: { slug } });
      if (existing && existing.id !== id) {
        throw new ConflictException('Program with this name already exists');
      }
      program.slug = slug;
    }

    Object.assign(program, updateProgramDto);
    return this.programsRepository.save(program);
  }

  async remove(id: string): Promise<void> {
    const program = await this.findOne(id);
    await this.programsRepository.remove(program);
  }
}
