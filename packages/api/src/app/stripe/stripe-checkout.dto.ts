import { StripePaymentDto } from '@degenex/common';

export type StripeCheckoutDto = StripePaymentDto & {
  successPath: string;
  cancelPath: string;
};
