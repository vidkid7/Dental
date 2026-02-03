import { IsString, IsOptional, IsBoolean, IsArray, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty({ example: '10 Tips for Better Oral Health' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Learn the essential tips for maintaining healthy teeth and gums.' })
  @IsString()
  excerpt: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  featuredImage?: string;

  @ApiProperty({ example: 'Dr. John Smith' })
  @IsString()
  author: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @ApiProperty({ example: 'Dental Care' })
  @IsString()
  category: string;

  @ApiPropertyOptional({ type: [String], example: ['oral health', 'dental tips'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
