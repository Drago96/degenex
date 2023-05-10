import { AbilityBuilder, InferSubjects, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery } from '@casl/prisma';
import { Injectable } from '@nestjs/common';

import { UserResponseDto } from '../users/user-response.dto';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects = InferSubjects<'all' | 'health'>;

export type AppAbility = PureAbility<[Action, Subjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserResponseDto) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    );

    if (user.roles.includes('Admin')) {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, 'all');
      cannot(Action.Read, 'health');
    }

    return build();
  }
}
