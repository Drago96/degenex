import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import Stripe from 'stripe';

export const PROCESS_STRIPE_EVENT_QUEUE_NAME = 'process-stripe-event';

@Processor(PROCESS_STRIPE_EVENT_QUEUE_NAME)
export class ProcessStripeEventConsumer {
  @Process()
  async process(job: Job<Stripe.Event>) {
    console.log(job.data);
  }
}
