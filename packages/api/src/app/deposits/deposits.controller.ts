import {
  Controller,
  Post,
  HttpCode,
  UseGuards,
  Req,
  Body,
} from '@nestjs/common';

import { StripePaymentDto } from '@degenex/common';
import { AccessTokenAuthGuard } from '../auth/access-token-auth.guard';
import { StripeService } from '../stripe/stripe.service';

@Controller('deposits')
@UseGuards(AccessTokenAuthGuard)
export class DepositsController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @HttpCode(201)
  async createDeposit(@Req() req, @Body() stripePaymentDto: StripePaymentDto) {
    return await this.stripeService.createCheckoutSession(
      req.user.id,
      'deposit',
      {
        ...stripePaymentDto,
        successPath: 'wallet/deposit/confirmation',
        cancelPath: 'wallet',
      }
    );
  }
}
