import { IsString, IsEmail, IsUUID, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsUUID()
  doctorId: string;

  @ApiProperty({ example: 'John Patient' })
  @IsString()
  patientName: string;

  @ApiProperty({ example: 'patient@email.com' })
  @IsEmail()
  patientEmail: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  patientPhone: string;

  @ApiProperty({ example: '2024-02-15' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '10:00' })
  @IsString()
  startTime: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
