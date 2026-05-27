import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from 'interceptor/response.global.interceptor';
import { setupSwagger } from './swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filter/global-exception.filter.ts/global-exception.filter.ts.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply global interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Setup OpenAPI
  setupSwagger(app);

  // Apply Global Validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove unknown fields
      forbidNonWhitelisted: false, // throw error for unknown fields
      transform: true, // tranform payloads types
    })
  )

  // Set Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
