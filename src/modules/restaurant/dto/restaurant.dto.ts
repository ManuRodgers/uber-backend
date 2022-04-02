import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { GraphQLUUID } from 'graphql-scalars';
import { CommonResponse } from 'src/common/CommonResponse';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/pagination.dto';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class RestaurantInput {
  @Field(() => GraphQLUUID, { nullable: false })
  restaurantId!: string;
}

@ObjectType()
export class RestaurantOutput extends CommonResponse {
  @Field(() => Restaurant, { nullable: true })
  restaurant?: Restaurant;
}
