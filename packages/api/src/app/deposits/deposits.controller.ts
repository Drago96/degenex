import {
  Controller,
  Post,
  HttpCode,
  UseGuards,
  Req,
  Body,
} from '@nestjs/common';

import { StripePaymentDto } from '@/stripe/stripe-payment.dto';
import { AccessTokenAuthGuard } from '../auth/access-token-auth.guard';
import { StripeService } from '../stripe/stripe.service';

@Controller('deposits')
@UseGuards(AccessTokenAuthGuard)
export class DepositsController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @HttpCode(204)
  async createDeposit(@Req() req, @Body() stripePaymentDto: StripePaymentDto) {
    await this.stripeService.createPaymentIntent(
      req.user.id,
      'deposit',
      stripePaymentDto
    );
  }
}
