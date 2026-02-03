"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: configService.get('FRONTEND_URL', 'http://localhost:3000'),
        credentials: true,
    });
    const apiPrefix = configService.get('API_PREFIX', 'api/v1');
    app.setGlobalPrefix(apiPrefix, { exclude: ['/', '/health'] });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    if (configService.get('NODE_ENV') !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Dental College API')
            .setDescription('API documentation for Dental College & Hospital website')
            .setVersion('1.0')
            .addBearerAuth()
            .addTag('auth', 'Authentication endpoints')
            .addTag('doctors', 'Doctor management')
            .addTag('appointments', 'Appointment booking')
            .addTag('departments', 'Department management')
            .addTag('services', 'Services management')
            .addTag('programs', 'Academic programs')
            .addTag('admissions', 'Admission applications')
            .addTag('blog', 'Blog posts')
            .addTag('enquiries', 'Contact enquiries')
            .addTag('media', 'Media uploads')
            .addTag('content', 'CMS content')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('docs', app, document);
    }
    const port = configService.get('PORT', 3001);
    await app.listen(port);
    console.log(`
  🦷 Dental College API Server
  ============================
  Environment: ${configService.get('NODE_ENV', 'development')}
  Port: ${port}
  API: http://localhost:${port}/${apiPrefix}
  Docs: http://localhost:${port}/docs
  `);
}
bootstrap();
//# sourceMappingURL=main.js.map