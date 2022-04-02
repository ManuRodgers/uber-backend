import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonResponse } from 'src/common/CommonResponse';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class MyRestaurantInput extends PickType(Restaurant, ['id'] as const) {}

@ObjectType()
export class MyRestaurantOutput extends CommonResponse {
  @Field(() => Restaurant, { nullable: true })
  restaurant?: Restaurant;
}
