import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { GraphQLUUID } from 'graphql-scalars';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from 'src/modules/restaurant/dto/create-restaurant.dto';

@InputType()
export class UpdateRestaurantInput extends PartialType(CreateRestaurantInput) {
  @Field(() => GraphQLUUID, { nullable: false })
  restaurantId!: string;
}

@ObjectType()
export class UpdateRestaurantOutput extends CreateRestaurantOutput {}
