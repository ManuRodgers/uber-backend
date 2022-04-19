import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonResponse } from 'src/common/CommonResponse';
import { Order } from '../entities/order.entity';

@InputType()
export class TakeOrderInput extends PickType(Order, ['id'] as const) {}

@ObjectType()
export class TakeOrderOutput extends CommonResponse {
  @Field(() => Order, { nullable: true })
  order?: Order;
}
