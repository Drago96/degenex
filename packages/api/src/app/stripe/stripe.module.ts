import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import {
  CreateStripeCustomerConsumer,
  CREATE_STRIPE_CUSTOMER_QUEUE_NAME,
} from './create-stripe-customer.consumer';
import { StripeService } from './stripe.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: CREATE_STRIPE_CUSTOMER_QUEUE_NAME,
    }),
  ],
  providers: [StripeService, CreateStripeCustomerConsumer],
  exports: [StripeService, BullModule],
})
export class StripeModule {}
