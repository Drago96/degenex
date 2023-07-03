import { Body, Controller, Post } from '@nestjs/common';
import Stripe from 'stripe';

@Controller('stripe')
export class StripeController {
  @Post('webhooks')
  async processWebhook(@Body() stripePayload: Stripe.Event) {
    console.log(stripePayload);

    return 'Ok';
  }
}
