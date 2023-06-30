import { Module } from '@nestjs/common';

import { StripeModule } from '@/stripe/stripe.module';
import { DepositsController } from './deposits.controller';

@Module({
  imports: [StripeModule],
  controllers: [DepositsController]
})
export class DepositsModule {}
