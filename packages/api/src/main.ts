import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { patchNestJsSwagger } from 'nestjs-zod';

import { AppModule } from './app/app.module';
import { EnvironmentVariables } from './app/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.setGlobalPrefix('/api');

  app.use(cookieParser());

  setupSwagger(app);

  const configService = app.get(ConfigService<EnvironmentVariables>);

  await app.listen(configService.get('PORT'));
}

function setupSwagger(app: INestApplication) {
  patchNestJsSwagger();
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Degenex API')
    .setDescription('Backend API for the Degenex application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

bootstrap();
