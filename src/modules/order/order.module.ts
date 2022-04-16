import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';

import { Dish } from '../restaurant/entities/dish.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { UserModule } from '../user/user.module';
import { Order } from './entities/order.entity';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Restaurant, Dish]), UserModule],
  providers: [OrderResolver, OrderService],
})
export class OrderModule {}
