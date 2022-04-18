import { InputType, ObjectType, PickType } from '@nestjs/graphql';

import { Order } from '../entities/order.entity';
import { CreateOrderOutput } from './create-order.dto';

@InputType()
export class UpdateOrderInput extends PickType(Order, [
  'id',
  'status',
] as const) {}

@ObjectType()
export class UpdateOrderOutput extends CreateOrderOutput {}
