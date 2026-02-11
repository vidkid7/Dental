import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { AdmissionApplication, ApplicationStatus } from './entities/admission.entity';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { UpdateAdmissionDto } from './dto/update-admission.dto';
import { PaginationDto, PaginatedResponseDto } from '@/common/dto/pagination.dto';
import { format } from 'date-fns';

@Injectable()
export class AdmissionsService {
  constructor(
    @InjectRepository(AdmissionApplication)
    private admissionsRepository: Repository<AdmissionApplication>,
    @Optional() @InjectQueue('notifications')
    private notificationsQueue?: Queue,
  ) {}

  async create(createAdmissionDto: CreateAdmissionDto): Promise<AdmissionApplication> {
    // Generate application number
    const year = format(new Date(), 'yyyy');
    const count = await this.admissionsRepository.count();
    const applicationNumber = `PDC-${year}-${String(count + 1).padStart(5, '0')}`;

    const application = this.admissionsRepository.create({
      ...createAdmissionDto,
      applicationNumber,
      status: ApplicationStatus.DRAFT,
    });

    return this.admissionsRepository.save(application);
  }

  async findAll(
    paginationDto: PaginationDto & { status?: ApplicationStatus; programId?: string },
  ): Promise<PaginatedResponseDto<AdmissionApplication>> {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      status,
      programId,
    } = paginationDto;

    const queryBuilder = this.admissionsRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.program', 'program');

    if (status) {
      queryBuilder.andWhere('application.status = :status', { status });
    }

    if (programId) {
      queryBuilder.andWhere('application.programId = :programId', { programId });
    }

    queryBuilder
      .orderBy(`application.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [applications, total] = await queryBuilder.getManyAndCount();

    return new PaginatedResponseDto(applications, total, page, limit);
  }

  async findOne(id: string): Promise<AdmissionApplication> {
    const application = await this.admissionsRepository.findOne({
      where: { id },
      relations: ['program'],
    });
    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }
    return application;
  }

  async findByApplicationNumber(applicationNumber: string): Promise<AdmissionApplication> {
    const application = await this.admissionsRepository.findOne({
      where: { applicationNumber },
      relations: ['program'],
    });
    if (!application) {
      throw new NotFoundException(`Application ${applicationNumber} not found`);
    }
    return application;
  }

  async update(id: string, updateAdmissionDto: UpdateAdmissionDto): Promise<AdmissionApplication> {
    const application = await this.findOne(id);
    Object.assign(application, updateAdmissionDto);
    return this.admissionsRepository.save(application);
  }

  async submit(id: string): Promise<AdmissionApplication> {
    const application = await this.findOne(id);
    application.status = ApplicationStatus.SUBMITTED;
    
    const savedApplication = await this.admissionsRepository.save(application);

    // Send confirmation notification (only if queue is available)
    if (this.notificationsQueue) {
      try {
        await this.notificationsQueue.add('admission-submitted', {
          applicationId: savedApplication.id,
          applicationNumber: savedApplication.applicationNumber,
          email: savedApplication.email,
          name: `${savedApplication.firstName} ${savedApplication.lastName}`,
        });
      } catch (error) {
        console.warn('Failed to queue notification:', error.message);
      }
    }

    return savedApplication;
  }

  async updateStatus(id: string, status: ApplicationStatus, remarks?: string): Promise<AdmissionApplication> {
    const application = await this.findOne(id);
    application.status = status;
    if (remarks) {
      application.remarks = remarks;
    }
    
    const savedApplication = await this.admissionsRepository.save(application);

    // Send status update notification (only if queue is available)
    if (this.notificationsQueue) {
      try {
        await this.notificationsQueue.add('admission-status-update', {
          applicationId: savedApplication.id,
          applicationNumber: savedApplication.applicationNumber,
          email: savedApplication.email,
          name: `${savedApplication.firstName} ${savedApplication.lastName}`,
          status,
        });
      } catch (error) {
        console.warn('Failed to queue notification:', error.message);
      }
    }

    return savedApplication;
  }

  async addDocument(
    id: string,
    document: { type: string; name: string; url: string },
  ): Promise<AdmissionApplication> {
    const application = await this.findOne(id);
    application.documents = [
      ...application.documents,
      { ...document, uploadedAt: new Date().toISOString() },
    ];
    return this.admissionsRepository.save(application);
  }

  async remove(id: string): Promise<void> {
    const application = await this.findOne(id);
    await this.admissionsRepository.remove(application);
  }
}
