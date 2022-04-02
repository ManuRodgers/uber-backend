import { Field, ObjectType } from '@nestjs/graphql';
import { CommonResponse } from 'src/common/CommonResponse';
import { Category } from 'src/modules/restaurant/entities/category.entity';

@ObjectType()
export class CategoriesOutput extends CommonResponse {
  @Field(() => [Category], { nullable: true })
  categories?: Category[];
}
