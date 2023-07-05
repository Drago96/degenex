import { Injectable } from '@nestjs/common';

import { StripePaymentDto } from '@degenex/common';
import { PrismaService } from '@/prisma/prisma.service';
import { StripeService } from '@/stripe/stripe.service';

@Injectable()
export class DepositsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService
  ) {}

  async createDeposit(userId: number, stripePaymentDto: StripePaymentDto) {
    const stripeCheckoutSession =
      await this.stripeService.createCheckoutSession(userId, {
        ...stripePaymentDto,
        chargeType: 'deposit',
        successPath: 'wallet/deposit/success',
        cancelPath: 'wallet',
      });

    return this.prisma.deposit.create({
      data: {
        userId,
        amount: stripePaymentDto.amount,
        assetTickerSymbol: stripePaymentDto.currency,
        sessionId: stripeCheckoutSession.id,
      },
    });
  }
}
