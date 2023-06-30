import { Controller, Post, HttpCode, UseGuards } from '@nestjs/common';

import { AccessTokenAuthGuard } from '../auth/access-token-auth.guard';
import { StripeService } from '../stripe/stripe.service';

@Controller('deposits')
@UseGuards(AccessTokenAuthGuard)
export class DepositsController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @HttpCode(204)
  async createDeposit() {}
}
