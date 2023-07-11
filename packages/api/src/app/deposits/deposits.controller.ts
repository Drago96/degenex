import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';

import { StripePaymentDto } from '@degenex/common';
import { AccessTokenAuthGuard } from '../auth/access-token-auth.guard';
import { DepositsService } from './deposits.service';
import { Deposit } from '@prisma/client';
import { RequestWithUser } from '@/types/request-with-user';

@Controller('deposits')
@UseGuards(AccessTokenAuthGuard)
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @Post()
  async createDeposit(
    @Req() req: RequestWithUser,
    @Body() stripePaymentDto: StripePaymentDto
  ): Promise<Deposit> {
    return this.depositsService.createDeposit(req.user.id, stripePaymentDto);
  }
}
