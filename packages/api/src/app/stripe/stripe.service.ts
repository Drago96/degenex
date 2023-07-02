import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

import { EnvironmentVariables } from '@/configuration';
import { PrismaService } from '@/prisma/prisma.service';
import { StripePaymentDto } from './stripe-payment.dto';
import { upperCase } from 'lodash';

type ChargeType = 'deposit';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService<EnvironmentVariables>
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

  async createCheckoutSession(
    userId: number,
    chargeType: ChargeType,
    stripePaymentDto: StripePaymentDto
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

    return this.stripe.checkout.sessions.create({
      customer: user.paymentsCustomerId,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: stripePaymentDto.currency,
            unit_amount: Number(stripePaymentDto.amount.toFixed(2)) * 100,
            product_data: {
              name: upperCase(chargeType),
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        chargeType,
      },
      success_url: `${this.configService.get('CLIENT_URL')}/wallet`,
      cancel_url: `${this.configService.get('CLIENT_URL')}/wallet`,
    });
  }
}
