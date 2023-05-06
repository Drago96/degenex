import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { MailerModule } from 'src/mailer/mailer.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './access-token.strategy';
import {
  QUEUE_NAME,
  SendVerificationCodeConsumer,
} from './send-verification-code.consumer';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    BullModule.registerQueue({
      name: QUEUE_NAME,
    }),
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, SendVerificationCodeConsumer],
})
export class AuthModule {}
