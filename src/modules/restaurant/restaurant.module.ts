import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/modules/restaurant/entities/category.entity';
import { Restaurant } from 'src/modules/restaurant/entities/restaurant.entity';
import { RestaurantService } from './restaurant.service';
import { CategoryResolver, RestaurantResolver } from './restaurant.resolver';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Category]), UserModule],
  providers: [RestaurantResolver, CategoryResolver, RestaurantService],
})
export class RestaurantModule {}
