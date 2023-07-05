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
import { DepositsService } from './deposits.service';

@Controller('deposits')
@UseGuards(AccessTokenAuthGuard)
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @Post()
  @HttpCode(201)
  async createDeposit(@Req() req, @Body() stripePaymentDto: StripePaymentDto) {
    return this.depositsService.createDeposit(req.user.id, stripePaymentDto);
  }
}
