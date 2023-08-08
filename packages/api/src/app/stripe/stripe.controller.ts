import { Controller, Headers, Post, RawBodyRequest, Req } from '@nestjs/common';

import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('webhooks')
  async processWebhook(
    @Req() request: RawBodyRequest<Request>,
    @Headers('stripe-signature') stripeSignature: string,
  ) {
    await this.stripeService.enqueueEvent(
      request.rawBody as Buffer,
      stripeSignature,
    );
  }
}
