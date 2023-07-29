import { AbilityBuilder, InferSubjects, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery } from '@casl/prisma';
import { Injectable } from '@nestjs/common';

import { UserResponseDto } from '@degenex/common';

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
      createPrismaAbility
    );

    can(Action.Read, 'all');
    cannot(Action.Read, 'health');

    if (user.roles.includes('Admin')) {
      can(Action.Manage, 'all');
    }

    return build();
  }
}
