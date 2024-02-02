import { OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

export abstract class BaseProcessor {
  protected abstract readonly logger: Logger;

  @OnQueueFailed()
  onError(job: Job<unknown>, error: Error) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }
}
