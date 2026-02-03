import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faculty } from './entities/faculty.entity';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';

@Injectable()
export class FacultyService {
  constructor(
    @InjectRepository(Faculty)
    private facultyRepository: Repository<Faculty>,
  ) {}

  async create(createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    const faculty = this.facultyRepository.create(createFacultyDto);
    return this.facultyRepository.save(faculty);
  }

  async findAll(departmentId?: string): Promise<Faculty[]> {
    const where: any = { isActive: true };
    if (departmentId) {
      where.departmentId = departmentId;
    }
    return this.facultyRepository.find({
      where,
      relations: ['department'],
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Faculty> {
    const faculty = await this.facultyRepository.findOne({
      where: { id },
      relations: ['department'],
    });
    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${id} not found`);
    }
    return faculty;
  }

  async update(id: string, updateFacultyDto: UpdateFacultyDto): Promise<Faculty> {
    const faculty = await this.findOne(id);
    Object.assign(faculty, updateFacultyDto);
    return this.facultyRepository.save(faculty);
  }

  async remove(id: string): Promise<void> {
    const faculty = await this.findOne(id);
    await this.facultyRepository.remove(faculty);
  }
}
