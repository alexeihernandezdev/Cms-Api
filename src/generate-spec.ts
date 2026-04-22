import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function generate() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('CMS API')
    .setDescription('API del CMS (NestJS + MongoDB)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('./openapi.json', JSON.stringify(document, null, 2));
  process.exit(0);
}
generate();
