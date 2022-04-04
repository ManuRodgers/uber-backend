import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { GraphQLUUID } from 'graphql-scalars';
import { CommonResponse } from 'src/common/CommonResponse';
import { Dish } from '../entities/dish.entity';

@InputType()
export class CreateDishInput extends PickType(Dish, [
  'name',
  'price',
  'photo',
  'description',
  'options',
] as const) {
  @Field(() => GraphQLUUID, { nullable: false })
  restaurantId!: string;
}

@ObjectType()
export class CreateDishOutput extends CommonResponse {
  @Field(() => Dish, { nullable: true })
  dish?: Dish;
}
