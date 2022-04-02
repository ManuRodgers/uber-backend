import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { GraphQLUUID } from 'graphql-scalars';
import { CommonResponse } from 'src/common/CommonResponse';
import { CreateRestaurantInput } from 'src/modules/restaurant/dto/create-restaurant.dto';
import { Restaurant } from 'src/modules/restaurant/entities/restaurant.entity';

@InputType()
export class UpdateRestaurantInput extends PartialType(CreateRestaurantInput) {
  @Field(() => GraphQLUUID, { nullable: false })
  restaurantId!: string;
}

@ObjectType()
export class UpdateRestaurantOutput extends CommonResponse {
  @Field(() => Restaurant, {
    nullable: true,
  })
  restaurant?: Restaurant;
}
