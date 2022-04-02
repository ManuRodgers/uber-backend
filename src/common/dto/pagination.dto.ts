import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CommonResponse } from 'src/common/CommonResponse';

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: false, defaultValue: 1 })
  page!: number;

  @Field(() => Int, { nullable: false, defaultValue: 25 })
  take!: number;
}

@ObjectType()
export class PaginationOutput extends CommonResponse {
  @Field(() => Int, { nullable: true })
  totalPages?: number;

  @Field(() => Int, { nullable: true })
  totalResults?: number;
}
