import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AdmissionsService } from './admissions.service';
import { AdmissionsController } from './admissions.controller';
import { AdmissionApplication } from './entities/admission.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdmissionApplication]),
    BullModule.registerQueue({ name: 'notifications' }),
    NotificationsModule,
  ],
  controllers: [AdmissionsController],
  providers: [AdmissionsService],
  exports: [AdmissionsService],
})
export class AdmissionsModule {}
