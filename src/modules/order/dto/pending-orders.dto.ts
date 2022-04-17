import { Field, ObjectType } from '@nestjs/graphql';
import { PENDING_ORDERS } from 'src/modules/pub-sub/pub-sub.constants';

import { Order } from '../entities/order.entity';

@ObjectType()
export class PendingOrdersOutPut {
  @Field(() => Order, { nullable: true })
  order?: Order;

  @Field(() => String, { nullable: true })
  ownerId?: string;
}

export class PendingOrdersPayload {
  [PENDING_ORDERS]?: PendingOrdersOutPut;
}
