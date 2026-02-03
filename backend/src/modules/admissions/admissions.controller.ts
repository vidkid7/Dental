import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdmissionsService } from './admissions.service';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { UpdateAdmissionDto } from './dto/update-admission.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { ApplicationStatus } from './entities/admission.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('admissions')
@Controller('admissions')
export class AdmissionsController {
  constructor(private readonly admissionsService: AdmissionsService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new admission application' })
  create(@Body() createAdmissionDto: CreateAdmissionDto) {
    return this.admissionsService.create(createAdmissionDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all admission applications' })
  @ApiQuery({ name: 'status', required: false, enum: ApplicationStatus })
  @ApiQuery({ name: 'programId', required: false })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('status') status?: ApplicationStatus,
    @Query('programId') programId?: string,
  ) {
    return this.admissionsService.findAll({ ...paginationDto, status, programId });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an application by ID' })
  findOne(@Param('id') id: string) {
    return this.admissionsService.findOne(id);
  }

  @Get('track/:applicationNumber')
  @Public()
  @ApiOperation({ summary: 'Track application by application number' })
  track(@Param('applicationNumber') applicationNumber: string) {
    return this.admissionsService.findByApplicationNumber(applicationNumber);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Update an application' })
  update(@Param('id') id: string, @Body() updateAdmissionDto: UpdateAdmissionDto) {
    return this.admissionsService.update(id, updateAdmissionDto);
  }

  @Patch(':id/submit')
  @Public()
  @ApiOperation({ summary: 'Submit an application' })
  submit(@Param('id') id: string) {
    return this.admissionsService.submit(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update application status' })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto) {
    return this.admissionsService.updateStatus(id, updateStatusDto.status, updateStatusDto.remarks);
  }

  @Post(':id/documents')
  @Public()
  @ApiOperation({ summary: 'Add document to application' })
  addDocument(
    @Param('id') id: string,
    @Body() document: { type: string; name: string; url: string },
  ) {
    return this.admissionsService.addDocument(id, document);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an application' })
  remove(@Param('id') id: string) {
    return this.admissionsService.remove(id);
  }
}
