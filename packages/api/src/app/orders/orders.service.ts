import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { OrderCreateDto } from './order-create.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(userId: number, orderCreateDto: OrderCreateDto) {
    const order = await this.prisma.order.create({
      data: {
        side: orderCreateDto.side,
        quantity: orderCreateDto.quantity,
        price: orderCreateDto.price,
        tradingPairId: orderCreateDto.tradingPairId,
        userId,
      },
      select: {
        side: true,
        quantity: true,
        price: true,
        tradingPairId: true,
        userId: true,
        orderBookId: true,
      },
    });

    console.log(order);
  }
}
