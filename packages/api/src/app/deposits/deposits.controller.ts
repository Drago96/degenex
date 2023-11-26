import { Controller, Post, UseGuards, Body, Param, ParseIntPipe } from '@nestjs/common';

import { StripePaymentDto } from '@degenex/common';
import { AccessTokenAuthGuard } from '../auth/access-token-auth.guard';
import { DepositsService } from './deposits.service';
import { Deposit } from '@prisma/client';
import { CurrentUserResourcesGuard } from '@/auth/current-user-resources.guard';

@Controller('users/:userId/deposits')
@UseGuards(AccessTokenAuthGuard, CurrentUserResourcesGuard)
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @Post()
  async createDeposit(
    @Param('userId', new ParseIntPipe()) userId: number,
    @Body() stripePaymentDto: StripePaymentDto,
  ): Promise<Deposit> {
    return this.depositsService.createDeposit(userId, stripePaymentDto);
  }
}
