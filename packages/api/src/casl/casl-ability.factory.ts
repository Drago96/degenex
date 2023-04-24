import {
  AbilityBuilder,
  Ability,
  InferSubjects,
  AbilityClass,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { UserResponseDto } from 'src/users/user-response.dto';
import { Action } from './action.enum';

type Subjects = InferSubjects<'all' | 'health'>;

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserResponseDto) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.roles.includes('Admin')) {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, 'all');
      cannot(Action.Read, 'health');
    }

    return build();
  }
}
