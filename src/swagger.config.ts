import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('School API')
    .setDescription('Practice Nest API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey({
      type: 'apiKey',
      name: 'x-api-key',
      in: 'header',
    }, 'api-key')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);
};