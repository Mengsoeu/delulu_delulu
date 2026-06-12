import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SkillsModule } from './module/skills/skills.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { AuthModule } from './module/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './guard/role/role.guard';
import { AuthGuard } from './guard/auth/auth.guard';
import { PermissionGuard } from './guard/permission/permission.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SkillsModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
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
