import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

import { EnvironmentVariables } from '@/configuration';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(configService: ConfigService<EnvironmentVariables>) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: null,
    });
  }

  public async createCustomer(email: string) {
    return this.stripe.customers.create({
      email,
    });
  }
}
