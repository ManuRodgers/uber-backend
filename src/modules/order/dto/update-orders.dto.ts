import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { UPDATE_ORDERS } from 'src/modules/pub-sub/pub-sub.constants';

import { Order } from '../entities/order.entity';

@InputType()
export class UpdateOrdersInput extends PickType(Order, ['id']) {}

@ObjectType()
export class UpdateOrdersOutput {
  @Field(() => Order, { nullable: true })
  order?: Order;
}

export class UpdateOrdersPayload {
  [UPDATE_ORDERS]: UpdateOrdersOutput;
}
