import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

export enum ProgramType {
  BDS = 'bds',
  MDS = 'mds',
  INTERNSHIP = 'internship',
  CERTIFICATE = 'certificate',
}

@Entity('academic_programs')
export class AcademicProgram extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({
    type: 'enum',
    enum: ProgramType,
  })
  type: ProgramType;

  @Column()
  duration: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  eligibility: string;

  @Column({ type: 'text', nullable: true })
  curriculum?: string;

  @Column({ nullable: true })
  fees?: string;

  @Column({ nullable: true })
  seats?: number;

  @Column({ nullable: true })
  image?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
