import { InjectRedis } from '@songkeys/nestjs-redis';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Redis } from 'ioredis';

import { SendVerificationCodeDto } from '@degenex/common';
import { MailerService } from '../mailer/mailer.service';
import { PrismaService } from '../prisma/prisma.service';
import { buildVerificationCodeKey } from './send-verification-code.utils';
import { Logger } from '@nestjs/common';

export const SEND_VERIFICATION_CODE_QUEUE_NAME = 'send-verification-code';

@Processor(SEND_VERIFICATION_CODE_QUEUE_NAME)
export class SendVerificationCodeConsumer {
  private readonly logger: Logger = new Logger(this.constructor.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly prisma: PrismaService,
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  @Process()
  async process(job: Job<SendVerificationCodeDto>) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: job.data.email },
    });

    if (userExists) {
      return;
    }

    const verificationCode = this.generateVerificationCode();

    await this.redis.set(
      buildVerificationCodeKey(job.data.email),
      verificationCode,
      'EX',
      60 * 30,
    );

    try {
      await this.mailerService.sendEmail({
        body: `<p>In order to verify your account, please use this one time code:</p>
               <b>${verificationCode}</b>`,
        receiver: job.data.email,
        subject: 'Welcome to Degenex!',
      });
    } catch (e) {
      this.logger.error(e);
    }
  }

  generateVerificationCode() {
    return Math.random().toString().substring(2, 8);
  }
}
