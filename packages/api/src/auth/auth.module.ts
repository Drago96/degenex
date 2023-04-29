import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { EnvironmentVariables } from 'src/configuration';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import {
  QUEUE_NAME,
  SendActivationEmailConsumer,
} from './send-activation-email.consumer';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    BullModule.registerQueue({
      name: QUEUE_NAME,
    }),
    UsersModule,
    MailerModule,
    EncryptionModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, SendActivationEmailConsumer],
})
export class AuthModule {}
