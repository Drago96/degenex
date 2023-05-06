import { UserRole } from '@prisma/client';

export class AccessTokenPayloadDto {
  sub: number;
  email: string;
  roles: UserRole[];
}
