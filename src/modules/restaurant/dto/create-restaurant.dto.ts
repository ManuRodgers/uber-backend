import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonResponse } from 'src/common/CommonResponse';

import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, [
  'name',
  'address',
  'coverImage',
] as const) {
  @Field(() => String, { nullable: false })
  categoryName!: string;
}

@ObjectType()
export class CreateRestaurantOutput extends CommonResponse {
  @Field(() => Restaurant, {
    nullable: true,
  })
  restaurant?: Restaurant;
}
