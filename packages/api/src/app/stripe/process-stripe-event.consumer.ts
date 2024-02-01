import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import Stripe from 'stripe';

import { PrismaService } from '@/prisma/prisma.service';
import { BaseProcessor } from '@/base-processor';
import { Logger } from '@nestjs/common';

export const PROCESS_STRIPE_EVENT_QUEUE_NAME = 'process-stripe-event';

@Processor(PROCESS_STRIPE_EVENT_QUEUE_NAME)
export class ProcessStripeEventConsumer extends BaseProcessor {
  protected readonly logger: Logger = new Logger(
    ProcessStripeEventConsumer.name,
  );

  constructor(private prisma: PrismaService) {
    super();
  }

  @Process()
  async process(job: Job<Stripe.Event>) {
    const event = job.data;

    if (event.type === 'checkout.session.completed') {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;

      if (checkoutSession.metadata?.chargeType === 'deposit') {
        await this.handleDeposit(checkoutSession);
      }
    }
  }

  private async handleDeposit(checkoutSession: Stripe.Checkout.Session) {
    if (checkoutSession.payment_status === 'paid') {
      const deposit = await this.prisma.deposit.findUnique({
        where: {
          transactionId: checkoutSession.id,
        },
      });

      if (!deposit) {
        return;
      }

      await this.prisma.$transaction([
        this.prisma.deposit.update({
          where: {
            transactionId: checkoutSession.id,
          },
          data: {
            status: 'Successful',
            transactionId: checkoutSession.payment_intent as string,
          },
        }),
        this.prisma.assetBalance.upsert({
          where: {
            userId_assetTickerSymbol: {
              userId: deposit.userId,
              assetTickerSymbol: deposit.assetTickerSymbol,
            },
          },
          update: {
            available: {
              increment: deposit.amount,
            },
          },
          create: {
            available: deposit.amount,
            userId: deposit.userId,
            assetTickerSymbol: deposit.assetTickerSymbol,
          },
        }),
      ]);
    }
  }
}
