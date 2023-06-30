import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { MailerModule } from '../mailer/mailer.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './access-token.strategy';
import {
  SEND_VERIFICATION_CODE_QUEUE_NAME,
  SendVerificationCodeConsumer,
} from './send-verification-code.consumer';
import { StripeModule } from '@/stripe/stripe.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    BullModule.registerQueue({
      name: SEND_VERIFICATION_CODE_QUEUE_NAME,
    }),
    MailerModule,
    StripeModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, SendVerificationCodeConsumer],
})
export class AuthModule {}
