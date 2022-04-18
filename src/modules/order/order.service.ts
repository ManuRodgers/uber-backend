import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisPubSub } from 'graphql-redis-subscriptions';
// eslint-disable-next-line import/no-named-as-default
import Redis from 'ioredis';
import { In, Repository } from 'typeorm';
import {
  PUB_SUB,
  PENDING_ORDERS,
  COOKED_ORDERS,
} from '../pub-sub/pub-sub.constants';

import { Dish } from '../restaurant/entities/dish.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { User, UserRole } from '../user/user.entity';
import { UserService } from '../user/user.service';
import {
  CookedOrdersOutput,
  CookedOrdersPayload,
} from './dto/cooked-orders.dto';
import {
  CreateOrderInput,
  CreateOrderInputItem,
  CreateOrderOutput,
} from './dto/create-order.dto';
import { OrderInput, OrderOutput } from './dto/order.dto';
import { OrdersInput, OrdersOutput } from './dto/orders.dto';
import {
  PendingOrdersOutPut,
  PendingOrdersPayload,
} from './dto/pending-orders.dto';
import { UpdateOrderInput, UpdateOrderOutput } from './dto/update-order.dto';
import { Order, OrderStatus } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,
    private readonly userService: UserService,
  ) {}

  async orders(userId: string, { status }: OrdersInput): Promise<OrdersOutput> {
    try {
      let orders: Order[] = [];
      const user = await this.userService.getUserById(userId);
      if (user.role === UserRole.CLIENT) {
        orders = await this.orderRepository.find({
          where: {
            customer: { id: userId },
            status,
          },
          relations: {
            restaurant: true,
            dishes: true,
            customer: true,
            driver: true,
          },
          select: {
            id: true,
            total: true,
            status: true,
          },
        });
      } else if (user.role === UserRole.DELIVERY) {
        orders = await this.orderRepository.find({
          where: {
            driver: { id: userId },
            status,
          },
          relations: {
            restaurant: true,
            dishes: true,
            customer: true,
            driver: true,
          },
          select: {
            id: true,
            total: true,
            status: true,
          },
        });
      } else if (user.role === UserRole.OWNER) {
        orders = (
          await this.restaurantRepository.find({
            where: {
              owner: { id: userId },
            },
            relations: {
              orders: true,
            },
          })
        )
          .map((restaurant) => restaurant.orders)
          .flat(1)
          .filter((order) => order.status === status);
      }

      return {
        ok: true,
        orders,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async order(
    userId: string,
    { id: orderId }: OrderInput,
  ): Promise<OrderOutput> {
    try {
      const user = await this.userService.getUserById(userId);
      const order = await this.orderRepository.findOne({
        where: {
          id: orderId,
        },
        relations: {
          restaurant: true,
          dishes: true,
          customer: true,
          driver: true,
        },
      });
      if (!order) {
        throw new Error('Order not found');
      }
      if (!this.canReadOrder(user, order)) {
        throw new UnauthorizedException(
          'You are not authorized to read this order',
        );
      }
      return {
        ok: true,
        order,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async createOrder(
    customerId: string,
    { restaurantId, createOrderInputItems }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      const customer = await this.userService.getUserById(customerId);
      const restaurant = await this.restaurantRepository.findOneBy({
        id: restaurantId,
      });
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      const { dishes, total } = await this.getDishesAndTotalPrice(
        createOrderInputItems,
      );
      const order = await this.orderRepository.save(
        this.orderRepository.create({
          customer,
          restaurant,
          dishes,
          total,
        }),
      );

      await this.pubSub.publish<PendingOrdersPayload>(PENDING_ORDERS, {
        [PENDING_ORDERS]: {
          ownerId: restaurant.ownerId,
          order,
        },
      });
      return {
        ok: true,
        order,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async updateOrder(
    userId: string,
    { id, status }: UpdateOrderInput,
  ): Promise<UpdateOrderOutput> {
    try {
      const user = await this.userService.getUserById(userId);
      const order = await this.orderRepository.findOneBy({ id });
      console.log(
        '🚀 ~ file: order.service.ts ~ line 197 ~ OrderService ~ order',
        order,
      );
      if (!order) {
        throw new Error('Order not found');
      }
      if (!this.canReadOrder(user, order)) {
        throw new UnauthorizedException(
          'You are not authorized to read this order',
        );
      }
      if (!this.canUpdateOrder(user, status)) {
        throw new UnauthorizedException(
          'You are not authorized to update this order',
        );
      }
      await this.orderRepository.save({
        id,
        status,
      });
      const newOrder = { ...order, status };
      console.log(
        '🚀 ~ file: order.service.ts ~ line 227 ~ OrderService ~ newOrder',
        newOrder,
      );
      if (user.role === UserRole.OWNER && status === OrderStatus.COOKED) {
        await this.pubSub.publish<CookedOrdersPayload>(COOKED_ORDERS, {
          [COOKED_ORDERS]: {
            order: newOrder,
          },
        });
      }
      return {
        ok: true,
        order,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  private canReadOrder(user: User, order: Order): boolean {
    if (user.role === UserRole.CLIENT) {
      return order.customerId === user.id;
    } else if (user.role === UserRole.DELIVERY) {
      return order.driverId === user.id;
    } else if (user.role === UserRole.OWNER) {
      return order.restaurant.ownerId === user.id;
    }
    return false;
  }

  private canUpdateOrder(user: User, status: OrderStatus): boolean {
    if (user.role === UserRole.DELIVERY) {
      return (
        status === OrderStatus.DELIVERED || status === OrderStatus.PICKEDUP
      );
    } else if (user.role === UserRole.OWNER) {
      return status === OrderStatus.COOKING || status === OrderStatus.COOKED;
    }
    return false;
  }

  private async getDishesAndTotalPrice(
    createOrderInputItems: CreateOrderInputItem[],
  ): Promise<{ dishes: Dish[]; total: number }> {
    const dishes = await this.dishRepository.find({
      where: {
        id: In(createOrderInputItems.map(({ dishId }) => dishId)),
      },
      relations: {
        options: true,
      },
    });
    let total = dishes.reduce((acc, dish) => {
      return acc + dish.price;
    }, 0);
    for (const createOrderInputItem of createOrderInputItems) {
      for (const dish of dishes) {
        if (dish.id === createOrderInputItem.dishId) {
          if (dish.options) {
            for (const option of dish.options) {
              if (
                createOrderInputItem.dishOptionIds.includes(option.id) &&
                option.extra
              ) {
                total += option.extra;
              }
            }
          }
        }
      }
    }

    return { dishes, total };
  }
}
