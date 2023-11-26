import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { UserResponseDto } from '@degenex/common';

@Injectable()
export class CurrentUserResourcesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user: UserResponseDto = request.user;
    const userId = Number(request.params.userId);

    return user.id === userId;
  }
}
