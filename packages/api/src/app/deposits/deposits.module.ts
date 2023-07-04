import { Module } from '@nestjs/common';

import { StripeModule } from '@/stripe/stripe.module';
import { DepositsController } from './deposits.controller';
import { DepositsService } from './deposits.service';

@Module({
  imports: [StripeModule],
  controllers: [DepositsController],
  providers: [DepositsService],
})
export class DepositsModule {}
