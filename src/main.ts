import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from 'interceptor/response.global.interceptor';
import { setupSwagger } from './swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply global interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Setup OpenAPI
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
