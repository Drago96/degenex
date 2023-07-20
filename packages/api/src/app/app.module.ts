import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { RedisModule } from '@liaoliaots/nestjs-redis';

import { EnvironmentVariables, validate } from './configuration';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { CaslModule } from './casl/casl.module';
import { MailerModule } from './mailer/mailer.module';
import { EncryptionModule } from './encryption/encryption.module';
import { TradingPairsModule } from './trading-pairs/trading-pairs.module';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { PrismaClientExceptionFilter } from './prisma/prisma-client-exception.filter';
import { StripeModule } from './stripe/stripe.module';
import { DepositsModule } from './deposits/deposits.module';
import { AssetBalancesModule } from './asset-balances/asset-balances.module';
import { OrdersModule } from './orders/orders.module';
import { OrderBookModule } from './order-book/order-book.module';

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
        configService: ConfigService<EnvironmentVariables>
      ) => ({
        redis: {
          host: configService.getOrThrow('REDIS_HOST'),
          port: configService.getOrThrow('REDIS_PORT'),
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
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>
      ) => ({
        config: {
          host: configService.getOrThrow('REDIS_HOST'),
          port: configService.getOrThrow('REDIS_PORT'),
        },
      }),
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    HealthModule,
    CaslModule,
    MailerModule,
    EncryptionModule,
    TradingPairsModule,
    StripeModule,
    DepositsModule,
    AssetBalancesModule,
    OrdersModule,
    OrderBookModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
  ],
})
export class AppModule {}
