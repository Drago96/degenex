import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import {
  CreateStripeCustomerConsumer,
  CREATE_STRIPE_CUSTOMER_QUEUE_NAME,
} from './create-stripe-customer.consumer';
import {
  ProcessStripeEventConsumer,
  PROCESS_STRIPE_EVENT_QUEUE_NAME,
} from './process-stripe-event.consumer';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: CREATE_STRIPE_CUSTOMER_QUEUE_NAME,
    }),
    BullModule.registerQueue({
      name: PROCESS_STRIPE_EVENT_QUEUE_NAME,
    }),
  ],
  providers: [
    StripeService,
    CreateStripeCustomerConsumer,
    ProcessStripeEventConsumer,
  ],
  controllers: [StripeController],
  exports: [StripeService, BullModule],
})
export class StripeModule {}
