import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { upperCase } from 'lodash';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

import { EnvironmentVariables } from '@/configuration';
import { PrismaService } from '@/prisma/prisma.service';
import { StripeCheckoutDto } from './stripe-checkout.dto';
import { PROCESS_STRIPE_EVENT_QUEUE_NAME } from './process-stripe-event.consumer';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(PROCESS_STRIPE_EVENT_QUEUE_NAME)
    private readonly processStripeEventQueue: Queue<Stripe.Event>,
    private readonly configService: ConfigService<EnvironmentVariables>
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: configService.get('STRIPE_API_VERSION'),
    });
  }

  async createCustomer(email: string) {
    return this.stripe.customers.create({
      email,
    });
  }

  async createCheckoutSession(
    userId: number,
    stripeCheckoutDto: StripeCheckoutDto
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
            currency: stripeCheckoutDto.currency,
            unit_amount: Number(stripeCheckoutDto.amount.toFixed(2)) * 100,
            product_data: {
              name: upperCase(stripeCheckoutDto.chargeType),
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        chargeType: stripeCheckoutDto.chargeType,
      },
      success_url: `${this.configService.get('CLIENT_URL')}/${
        stripeCheckoutDto.successPath
      }`,
      cancel_url: `${this.configService.get('CLIENT_URL')}/${
        stripeCheckoutDto.cancelPath
      }`,
    });
  }

  async prepareEvent(stripePayload: Buffer, stripeSignature: string) {
    let event: Stripe.Event;

    try {
      event = await this.stripe.webhooks.constructEventAsync(
        stripePayload,
        stripeSignature,
        this.configService.get('STRIPE_WEBHOOK_SIGNING_SECRET')
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    await this.processStripeEventQueue.add(event);
  }
}
