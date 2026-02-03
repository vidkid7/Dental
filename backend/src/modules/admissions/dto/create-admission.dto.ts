import {
  IsString,
  IsEmail,
  IsUUID,
  IsDateString,
  IsEnum,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../entities/admission.entity';

export class CreateAdmissionDto {
  @ApiProperty()
  @IsUUID()
  programId: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john.doe@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '1998-05-15' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: 'American' })
  @IsString()
  nationality: string;

  @ApiProperty({ example: '123 Main St, City, State 12345' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'High School Diploma' })
  @IsString()
  previousEducation: string;

  @ApiProperty({ example: 85.5 })
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;

  @ApiProperty({ example: 2023 })
  @IsNumber()
  passingYear: number;
}
