import { Field, ObjectType } from '@nestjs/graphql';

import { Order } from '../entities/order.entity';

@ObjectType()
export class PendingOrderOutPut {
  @Field(() => Order, { nullable: true })
  order?: Order;

  @Field(() => String, { nullable: true })
  ownerId?: string;
}
