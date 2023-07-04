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
import { DepositsService } from './deposits.service';

@Controller('deposits')
@UseGuards(AccessTokenAuthGuard)
export class DepositsController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly depositsService: DepositsService
  ) {}

  @Post()
  @HttpCode(201)
  async createDeposit(@Req() req, @Body() stripePaymentDto: StripePaymentDto) {
    const stripeCheckoutSession =
      await this.stripeService.createCheckoutSession(req.user.id, 'deposit', {
        ...stripePaymentDto,
        successPath: 'wallet/deposit/success',
        cancelPath: 'wallet',
      });

    return this.depositsService.createDeposit({
      amount: stripePaymentDto.amount,
      assetTickerSymbol: stripePaymentDto.currency,
      transactionId: stripeCheckoutSession.id,
      userId: req.user.id,
    });
  }
}
