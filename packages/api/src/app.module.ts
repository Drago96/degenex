import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { EnvironmentVariables, validate } from './configuration';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { CaslModule } from './casl/casl.module';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from './mailer/mailer.module';
import { EncryptionModule } from './encryption/encryption.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
      validate,
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 60 * 1000,
          },
        },
      }),
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    HealthModule,
    CaslModule,
    MailerModule,
    EncryptionModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
