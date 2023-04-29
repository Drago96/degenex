import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as moment from 'moment';

import { EncryptionService } from 'src/encryption/encryption.service';
import { MailerService } from 'src/mailer/mailer.service';
import { UsersService } from 'src/users/users.service';
import { ActivationTokenDto } from './activation-token.dto';
import { SendActivationEmailDto } from './send-activation-email.dto';

export const QUEUE_NAME = 'send-activation-email';

@Processor(QUEUE_NAME)
export class SendActivationEmailConsumer {
  constructor(
    private mailerService: MailerService,
    private usersService: UsersService,
    private encryptionService: EncryptionService,
  ) {}

  @Process()
  async transcode(job: Job<SendActivationEmailDto>) {
    const user = await this.usersService.getUser({ email: job.data.email });

    if (!user || user.status !== 'Pending') {
      return;
    }

    const activationToken = this.generateActivationToken(job.data.email);

    return this.mailerService.sendEmail({
      body: `<p>Please confirm your email by clicking the link below:</p>
               <a>${JSON.stringify(activationToken)}</a>`,
      receiver: job.data.email,
      subject: 'Welcome to Degenex!',
    });
  }

  private generateActivationToken(userEmail: string) {
    const content: ActivationTokenDto = {
      email: userEmail,
      expirationDate: moment().add(30, 'minutes').toDate(),
    };

    return this.encryptionService.encrypt(content);
  }
}
