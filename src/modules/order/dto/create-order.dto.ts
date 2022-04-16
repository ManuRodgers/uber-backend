import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { GraphQLUUID } from 'graphql-scalars';
import { CommonResponse } from 'src/common/CommonResponse';

import { Order } from '../entities/order.entity';

@InputType()
export class CreateOrderInputItem {
  @Field(() => GraphQLUUID, { nullable: false })
  dishId!: string;

  @Field(() => [GraphQLUUID], { nullable: true })
  dishOptionIds?: string[];
}

@InputType()
export class CreateOrderInput {
  @Field(() => GraphQLUUID, { nullable: false })
  restaurantId!: string;

  @Field(() => [CreateOrderInputItem], { nullable: false })
  createOrderInputItems!: CreateOrderInputItem[];
}

@ObjectType()
export class CreateOrderOutput extends CommonResponse {
  @Field(() => Order, { nullable: true })
  order?: Order;
}
