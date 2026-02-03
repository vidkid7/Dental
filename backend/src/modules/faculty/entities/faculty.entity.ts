import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Department } from '@/modules/departments/entities/department.entity';

@Entity('faculty')
export class Faculty extends BaseEntity {
  @Column()
  name: string;

  @Column()
  designation: string;

  @Column()
  qualification: string;

  @Column({ name: 'department_id' })
  departmentId: string;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({ nullable: true })
  photo?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  specialization?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'simple-array', nullable: true })
  publications?: string[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ default: 0 })
  order: number;
}
