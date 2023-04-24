import { UserRole } from '@prisma/client';

export class JwtPayloadDto {
  sub: number;
  email: string;
  roles: UserRole[];
}
