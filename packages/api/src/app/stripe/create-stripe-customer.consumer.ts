import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { PrismaService } from '@/prisma/prisma.service';
import { StripeService } from './stripe.service';
import { CreateStripeCustomerDto } from './dto/create-stripe-customer.dto';
import { BaseProcessor } from '@/base-processor';
import { Logger } from '@nestjs/common';

export const CREATE_STRIPE_CUSTOMER_QUEUE_NAME = 'create-stripe-customer';

@Processor(CREATE_STRIPE_CUSTOMER_QUEUE_NAME)
export class CreateStripeCustomerConsumer extends BaseProcessor {
  protected readonly logger: Logger = new Logger(
    CreateStripeCustomerConsumer.name,
  );

  constructor(
    private readonly stripeService: StripeService,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  @Process()
  async process(job: Job<CreateStripeCustomerDto>) {
    const stripeCustomer = await this.stripeService.createCustomer(
      job.data.email,
    );

    return this.prisma.user.update({
      where: {
        email: job.data.email,
      },
      data: {
        paymentsCustomerId: stripeCustomer.id,
      },
    });
  }
}
