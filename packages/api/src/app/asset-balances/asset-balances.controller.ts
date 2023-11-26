import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';

import { AccessTokenAuthGuard } from '@/auth/access-token-auth.guard';
import { AssetBalancesService } from './asset-balances.service';
import { AssetBalancesQueryDto } from './dto/asset-balances-query.dto';
import { AssetBalanceResponseDto } from '@degenex/common';
import { CurrentUserResourcesGuard } from '@/auth/current-user-resources.guard';

@Controller('users/:userId/asset-balances')
@UseGuards(AccessTokenAuthGuard, CurrentUserResourcesGuard)
export class AssetBalancesController {
  constructor(private readonly assetBalancesService: AssetBalancesService) {}

  @Get()
  @ZodSerializerDto(AssetBalanceResponseDto)
  async getMany(
    @Param('userId', new ParseIntPipe()) userId: number,
    @Query() assetBalancesQueryDto: AssetBalancesQueryDto,
  ): Promise<AssetBalanceResponseDto[]> {
    return await this.assetBalancesService.getMany(
      userId,
      assetBalancesQueryDto.assetType,
    );
  }
}
