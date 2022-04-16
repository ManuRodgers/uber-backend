import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonResponse } from 'src/common/CommonResponse';

import { Order } from '../entities/order.entity';

@InputType()
export class OrderInput extends PickType(Order, ['id']) {}

@ObjectType()
export class OrderOutput extends CommonResponse {
  @Field(() => Order, { nullable: true })
  order?: Order;
}
