import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { CurrentUserId } from 'src/decorators/current-user-id.decorator';
import { Roles } from 'src/decorators/role.decorator';

import {
  COOKED_ORDERS,
  PENDING_ORDERS,
  PUB_SUB,
} from '../pub-sub/pub-sub.constants';
import { CookedOrdersOutput } from './dto/cooked-orders.dto';
import { CreateOrderInput, CreateOrderOutput } from './dto/create-order.dto';
import { OrderInput, OrderOutput } from './dto/order.dto';
import { OrdersInput, OrdersOutput } from './dto/orders.dto';
import {
  PendingOrdersOutPut,
  PendingOrdersPayload,
} from './dto/pending-orders.dto';
import { UpdateOrderInput, UpdateOrderOutput } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  @Query(() => OrdersOutput)
  @Roles(['ANY'])
  async orders(
    @CurrentUserId() userId: string,
    @Args('ordersInput') ordersInput: OrdersInput,
  ): Promise<OrdersOutput> {
    return this.orderService.orders(userId, ordersInput);
  }

  @Query(() => OrderOutput)
  @Roles(['ANY'])
  async order(
    @CurrentUserId() userId: string,
    @Args('orderInput') orderInput: OrderInput,
  ): Promise<OrderOutput> {
    return this.orderService.order(userId, orderInput);
  }

  @Mutation(() => CreateOrderOutput)
  @Roles(['CLIENT'])
  async createOrder(
    @CurrentUserId() customerId: string,
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.orderService.createOrder(customerId, createOrderInput);
  }

  @Mutation(() => UpdateOrderOutput)
  @Roles(['OWNER', 'DELIVERY'])
  async updateOrder(
    @CurrentUserId() userId: string,
    @Args('updateOrderInput') updateOrderInput: UpdateOrderInput,
  ): Promise<UpdateOrderOutput> {
    return this.orderService.updateOrder(userId, updateOrderInput);
  }

  @Subscription(() => PendingOrdersOutPut, {
    name: PENDING_ORDERS,
    filter(payload: PendingOrdersPayload, _, context): boolean {
      return payload.pendingOrders.ownerId === context.req.user.sub;
    },
    resolve({ pendingOrders }: PendingOrdersPayload): PendingOrdersOutPut {
      return pendingOrders;
    },
  })
  @Roles(['OWNER'])
  pendingOrders() {
    return this.pubSub.asyncIterator(PENDING_ORDERS);
  }

  @Subscription(() => CookedOrdersOutput, {
    name: COOKED_ORDERS,
  })
  @Roles(['DELIVERY'])
  cookedOrders() {
    return this.pubSub.asyncIterator(COOKED_ORDERS);
  }
}
