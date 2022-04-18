import { ObjectType, PickType } from '@nestjs/graphql';
import { COOKED_ORDERS } from 'src/modules/pub-sub/pub-sub.constants';

import { PendingOrdersOutPut } from './pending-orders.dto';

@ObjectType()
export class CookedOrdersOutput extends PickType(PendingOrdersOutPut, [
  'order',
] as const) {}

export class CookedOrdersPayload {
  [COOKED_ORDERS]?: CookedOrdersOutput;
}
