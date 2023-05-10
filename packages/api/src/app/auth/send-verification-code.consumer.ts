import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Redis } from 'ioredis';

import { MailerService } from '../mailer/mailer.service';
import { PrismaService } from '../prisma/prisma.service';
import { SendVerificationCodeDto } from './send-verification-code.dto';
import { buildVerificationCodeKey } from './send-verification-code.utils';

export const QUEUE_NAME = 'send-verification-code';

@Processor(QUEUE_NAME)
export class SendVerificationCodeConsumer {
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

    return this.mailerService.sendEmail({
      body: `<p>In order to verify your account, please use this one time code:</p>
             <b>${verificationCode}</b>`,
      receiver: job.data.email,
      subject: 'Welcome to Degenex!',
    });
  }

  generateVerificationCode() {
    return Math.random().toString().substring(2, 8);
  }
}
