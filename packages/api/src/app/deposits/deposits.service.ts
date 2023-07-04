import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { DepositCreateDto } from './deposit-create.dto';

@Injectable()
export class DepositsService {
  constructor(private readonly prisma: PrismaService) {}

  async createDeposit(depositCreateDto: DepositCreateDto) {
    return this.prisma.deposit.create({
      data: depositCreateDto,
    });
  }
}
