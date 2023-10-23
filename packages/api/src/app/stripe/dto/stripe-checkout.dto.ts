import { StripePaymentDto } from '@degenex/common';

type ChargeType = 'deposit';

export type StripeCheckoutDto = StripePaymentDto & {
  chargeType: ChargeType;
  successPath: string;
  cancelPath: string;
};
