import { UserRole } from '.prisma/client';

export class UserResponseDto {
  id: number;
  email: string;
  roles: UserRole[];
}
