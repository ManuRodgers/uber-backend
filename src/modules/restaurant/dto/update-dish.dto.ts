import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { GraphQLUUID } from 'graphql-scalars';

import { CreateDishInput, CreateDishOutput } from './create-dish.dto';

@InputType()
export class UpdateDishInput extends PartialType(CreateDishInput) {
  @Field(() => GraphQLUUID, { nullable: false })
  dishId!: string;
}

@ObjectType()
export class UpdateDishOutput extends CreateDishOutput {}
