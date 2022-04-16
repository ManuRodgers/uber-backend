import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonResponse } from 'src/common/CommonResponse';
import { Order, OrderStatus } from '../entities/order.entity';

@InputType()
export class OrdersInput {
  @Field(() => OrderStatus, { nullable: true })
  status?: OrderStatus;
}

@ObjectType()
export class OrdersOutput extends CommonResponse {
  @Field(() => [Order], { nullable: true })
  orders?: Order[];
}
