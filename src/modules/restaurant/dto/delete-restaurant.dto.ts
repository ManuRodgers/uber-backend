import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import {
  UpdateRestaurantInput,
  UpdateRestaurantOutput,
} from 'src/modules/restaurant/dto/update-restaurant.dto';

@InputType()
export class DeleteRestaurantInput extends PickType(UpdateRestaurantInput, [
  'restaurantId',
] as const) {}

@ObjectType()
export class DeleteRestaurantOutput extends UpdateRestaurantOutput {}
