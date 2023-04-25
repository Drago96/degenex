import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { SendActivationEmailDto } from './send-activation-email.dto';

export const QUEUE_NAME = 'send-activation-email';

@Processor(QUEUE_NAME)
export class SendActivationEmailConsumer {
  @Process()
  async transcode(job: Job<SendActivationEmailDto>) {
    console.log(job.data);
  }
}
