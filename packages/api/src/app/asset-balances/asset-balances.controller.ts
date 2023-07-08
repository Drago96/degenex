import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';

import { AccessTokenAuthGuard } from '@/auth/access-token-auth.guard';
import { AssetBalancesService } from './asset-balances.service';
import { AssetBalancesQueryDto } from './asset-balances-query.dto';
import { AssetBalanceResponseDto } from '@degenex/common';

@UseGuards(AccessTokenAuthGuard)
@Controller('asset-balances')
export class AssetBalancesController {
  constructor(private readonly assetBalancesService: AssetBalancesService) {}

  @Get()
  @ZodSerializerDto(AssetBalanceResponseDto)
  async getMany(
    @Req() req,
    @Query() assetBalancesQueryDto: AssetBalancesQueryDto
  ): Promise<AssetBalanceResponseDto[]> {
    return await this.assetBalancesService.getMany(
      req.user.id,
      assetBalancesQueryDto.assetType
    );
  }
}
