import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SkillsModule } from './module/skills/skills.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { SkillsController } from './module/skills/skills.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SkillsModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    /**
     * Apply for all routes
     */
    consumer.apply(LoggerMiddleware).forRoutes('*');

    /**
     * Exclude specific route
     */
    // consumer.apply(LoggerMiddleware).exclude('auth/login', 'auth/register').forRoutes('*');

    /**
     * Apply for specific controller
     */
    // consumer.apply(LoggerMiddleware).forRoutes(SkillsController);

    /**
     * Apply for specific route
     */
    // consumer.apply(LoggerMiddleware).forRoutes({
    //   path: 'skills',
    //   method: RequestMethod.GET
    // })
  }
}
