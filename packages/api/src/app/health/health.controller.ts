import { Controller, Get, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ApiExcludeController } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';

import { Action, AppAbility } from '../casl/casl-ability.factory';
import { CheckPolicies, PoliciesGuard } from '../casl/policies.guard';
import { EnvironmentVariables } from '../configuration';
import { PrismaHealthIndicator } from './prisma.health';

@ApiExcludeController()
@Controller('health')
export class HealthController {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly health: HealthCheckService,
    private readonly db: PrismaHealthIndicator,
    private readonly microservice: MicroserviceHealthIndicator,
  ) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'health'))
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () =>
        this.microservice.pingCheck('redis', {
          transport: Transport.REDIS,
          options: {
            url: `redis://${this.configService.get(
              'REDIS_HOST',
            )}:${this.configService.get('REDIS_PORT')}`,
          },
        }),
    ]);
  }
}
