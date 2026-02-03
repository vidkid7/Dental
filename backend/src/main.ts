import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: configService.get('FRONTEND_URL', 'http://localhost:3000'),
    credentials: true,
  });

  // Global prefix (exclude root so GET / returns API info)
  const apiPrefix = configService.get('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix, { exclude: ['/', '/health'] });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
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

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
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
