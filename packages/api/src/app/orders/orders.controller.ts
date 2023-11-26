import {
  Controller,
  Post,
  UseGuards,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { AccessTokenAuthGuard } from '../auth/access-token-auth.guard';
import { Order } from '@prisma/client';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUserResourcesGuard } from '@/auth/current-user-resources.guard';

@Controller('users/:userId/orders')
@UseGuards(AccessTokenAuthGuard, CurrentUserResourcesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @Param('userId', new ParseIntPipe()) userId: number,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    return await this.ordersService.createOrder(userId, createOrderDto);
  }
}
