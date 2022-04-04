import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { UpdateDishInput, UpdateDishOutput } from './update-dish.dto';

@InputType()
export class DeleteDishInput extends PickType(UpdateDishInput, ['dishId']) {}

@ObjectType()
export class DeleteDishOutput extends UpdateDishOutput {}
