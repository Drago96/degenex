export const buildVerificationCodeKey = (userEmail: string) =>
  `verification-code:${userEmail}`;
