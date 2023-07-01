import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

import { EnvironmentVariables } from '@/configuration';
import { StripePaymentDto } from './stripe-payment.dto';
import { PrismaService } from '@/prisma/prisma.service';

type ChargeType = 'deposit';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService<EnvironmentVariables>
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: null,
    });
  }

  async createCustomer(email: string) {
    return this.stripe.customers.create({
      email,
    });
  }

  async createPaymentIntent(
    userId: number,
    chargeType: ChargeType,
    stripePaymentDto: StripePaymentDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        paymentsCustomerId: true,
      },
    });

    if (!user.paymentsCustomerId) {
      throw new BadRequestException(
        'User has no associated payments customer id'
      );
    }

    return this.stripe.paymentIntents.create({
      customer: user.paymentsCustomerId,
      payment_method: stripePaymentDto.paymentMethod,
      amount: stripePaymentDto.amount,
      currency: stripePaymentDto.currency,
      metadata: {
        chargeType,
      },
    });
  }
}
