import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';

import { AppController } from './app.controller';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { ServicesModule } from './modules/services/services.module';
import { ProgramsModule } from './modules/programs/programs.module';
import { AdmissionsModule } from './modules/admissions/admissions.module';
import { BlogModule } from './modules/blog/blog.module';
import { EnquiriesModule } from './modules/enquiries/enquiries.module';
import { MediaModule } from './modules/media/media.module';
import { ContentModule } from './modules/content/content.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { FacultyModule } from './modules/faculty/faculty.module';
import { ClinicsModule } from './modules/clinics/clinics.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  controllers: [AppController],
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database (PostgreSQL)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // Check if DATABASE_URL is provided (Railway/production)
        const databaseUrl = configService.get('DATABASE_URL');
        
        if (databaseUrl) {
          // Parse DATABASE_URL for Railway
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: configService.get('NODE_ENV') === 'development',
            logging: configService.get('NODE_ENV') === 'development',
            ssl: {
              rejectUnauthorized: false,
            },
          };
        }
        
        // Use individual env variables for local development
        return {
          type: 'postgres',
          host: configService.get('DATABASE_HOST', 'localhost'),
          port: configService.get('DATABASE_PORT', 5432),
          username: configService.get('DATABASE_USER', 'dental_user'),
          password: configService.get('DATABASE_PASSWORD', 'dental_password'),
          database: configService.get('DATABASE_NAME', 'dental_db'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get('NODE_ENV') === 'development',
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
      inject: [ConfigService],
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ([{
        ttl: configService.get('THROTTLE_TTL', 60) * 1000,
        limit: configService.get('THROTTLE_LIMIT', 100),
      }]),
      inject: [ConfigService],
    }),

    // Task scheduling
    ScheduleModule.forRoot(),

    // Queue (Bull) - Temporarily disabled until Redis is available
    // BullModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     redis: {
    //       host: configService.get('REDIS_HOST', 'localhost'),
    //       port: configService.get('REDIS_HOST', 6379),
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),

    // Feature modules
    AuthModule,
    UsersModule,
    DoctorsModule,
    AppointmentsModule,
    DepartmentsModule,
    ServicesModule,
    ProgramsModule,
    AdmissionsModule,
    BlogModule,
    EnquiriesModule,
    MediaModule,
    ContentModule,
    TestimonialsModule,
    FacultyModule,
    ClinicsModule,
    ChatbotModule,
    NotificationsModule,
    SettingsModule,
  ],
})
export class AppModule {}
