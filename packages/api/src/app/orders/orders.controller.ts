import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';

import { AccessTokenAuthGuard } from '../auth/access-token-auth.guard';
import { Order } from '@prisma/client';
import { RequestWithUser } from '@/types/request-with-user';
import { OrdersService } from './orders.service';
import { OrderCreateDto } from './order-create.dto';

@Controller('orders')
@UseGuards(AccessTokenAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createDeposit(
    @Req() req: RequestWithUser,
    @Body() orderCreateDto: OrderCreateDto
  ): Promise<Order> {
    return await this.ordersService.createOrder(req.user.id, orderCreateDto);
  }
}
