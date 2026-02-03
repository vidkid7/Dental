import { IsString, IsOptional, IsBoolean, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProgramType } from '../entities/program.entity';

export class CreateProgramDto {
  @ApiProperty({ example: 'Bachelor of Dental Surgery (BDS)' })
  @IsString()
  name: string;

  @ApiProperty({ enum: ProgramType })
  @IsEnum(ProgramType)
  type: ProgramType;

  @ApiProperty({ example: '5 years' })
  @IsString()
  duration: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  eligibility: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  curriculum?: string;

  @ApiPropertyOptional({ example: '$50,000/year' })
  @IsOptional()
  @IsString()
  fees?: string;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @IsNumber()
  seats?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
