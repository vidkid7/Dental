import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmissionsService } from './admissions.service';
import { AdmissionsController } from './admissions.controller';
import { AdmissionApplication } from './entities/admission.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdmissionApplication]),
    // BullModule removed - notifications queue is optional
    NotificationsModule,
  ],
  controllers: [AdmissionsController],
  providers: [AdmissionsService],
  exports: [AdmissionsService],
})
export class AdmissionsModule {}
