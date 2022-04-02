import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonResponse } from 'src/common/CommonResponse';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/pagination.dto';
import { Restaurant } from 'src/modules/restaurant/entities/restaurant.entity';

@InputType()
export class SearchRestaurantInput extends PaginationInput {
  @Field(() => String, { nullable: false })
  query!: string;
}

@ObjectType()
export class SearchRestaurantOutput extends PaginationOutput {
  @Field(() => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];
}
