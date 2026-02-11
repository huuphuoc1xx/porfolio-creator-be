import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP.port') ?? 10001;
  const corsOrigins = configService.get<string[]>('APP.corsOrigins') ?? [];

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription('API for multi-portfolio app. Create and serve portfolios by slug.')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth')
    .addTag('portfolios')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  console.log(`Portfolio API: http://localhost:${port}`);
  console.log(`Swagger docs:  http://localhost:${port}/api/docs`);
}
bootstrap();
