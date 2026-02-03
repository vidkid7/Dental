import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { AcademicProgram } from '@/modules/programs/entities/program.entity';

export enum ApplicationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  SHORTLISTED = 'shortlisted',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity('admission_applications')
export class AdmissionApplication extends BaseEntity {
  @Column({ name: 'application_number', unique: true })
  applicationNumber: string;

  @Column({ name: 'program_id' })
  programId: string;

  @ManyToOne(() => AcademicProgram)
  @JoinColumn({ name: 'program_id' })
  program: AcademicProgram;

  // Personal Information
  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column()
  nationality: string;

  @Column({ type: 'text' })
  address: string;

  // Academic Information
  @Column({ name: 'previous_education' })
  previousEducation: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentage: number;

  @Column({ name: 'passing_year' })
  passingYear: number;

  // Documents
  @Column({ type: 'jsonb', default: [] })
  documents: { type: string; name: string; url: string; uploadedAt: string }[];

  // Status
  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.DRAFT,
  })
  status: ApplicationStatus;

  @Column({ type: 'text', nullable: true })
  remarks?: string;
}
