"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const schedule_1 = require("@nestjs/schedule");
const app_controller_1 = require("./app.controller");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const doctors_module_1 = require("./modules/doctors/doctors.module");
const appointments_module_1 = require("./modules/appointments/appointments.module");
const departments_module_1 = require("./modules/departments/departments.module");
const services_module_1 = require("./modules/services/services.module");
const programs_module_1 = require("./modules/programs/programs.module");
const admissions_module_1 = require("./modules/admissions/admissions.module");
const blog_module_1 = require("./modules/blog/blog.module");
const enquiries_module_1 = require("./modules/enquiries/enquiries.module");
const media_module_1 = require("./modules/media/media.module");
const content_module_1 = require("./modules/content/content.module");
const testimonials_module_1 = require("./modules/testimonials/testimonials.module");
const faculty_module_1 = require("./modules/faculty/faculty.module");
const clinics_module_1 = require("./modules/clinics/clinics.module");
const chatbot_module_1 = require("./modules/chatbot/chatbot.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const settings_module_1 = require("./modules/settings/settings.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [app_controller_1.AppController],
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DATABASE_HOST', 'localhost'),
                    port: configService.get('DATABASE_PORT', 5432),
                    username: configService.get('DATABASE_USER', 'dental_user'),
                    password: configService.get('DATABASE_PASSWORD', 'dental_password'),
                    database: configService.get('DATABASE_NAME', 'dental_db'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: configService.get('NODE_ENV') === 'development',
                    logging: configService.get('NODE_ENV') === 'development',
                }),
                inject: [config_1.ConfigService],
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ([{
                        ttl: configService.get('THROTTLE_TTL', 60) * 1000,
                        limit: configService.get('THROTTLE_LIMIT', 100),
                    }]),
                inject: [config_1.ConfigService],
            }),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            doctors_module_1.DoctorsModule,
            appointments_module_1.AppointmentsModule,
            departments_module_1.DepartmentsModule,
            services_module_1.ServicesModule,
            programs_module_1.ProgramsModule,
            admissions_module_1.AdmissionsModule,
            blog_module_1.BlogModule,
            enquiries_module_1.EnquiriesModule,
            media_module_1.MediaModule,
            content_module_1.ContentModule,
            testimonials_module_1.TestimonialsModule,
            faculty_module_1.FacultyModule,
            clinics_module_1.ClinicsModule,
            chatbot_module_1.ChatbotModule,
            notifications_module_1.NotificationsModule,
            settings_module_1.SettingsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map