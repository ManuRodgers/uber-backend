import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/pagination.dto';
import { Category } from 'src/modules/restaurant/entities/category.entity';
import { Restaurant } from 'src/modules/restaurant/entities/restaurant.entity';

@InputType()
export class CategoryInput extends PaginationInput {
  @Field(() => String, { nullable: false })
  categorySlug!: string;
}

@ObjectType()
export class CategoryOutput extends PaginationOutput {
  @Field(() => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];

  @Field(() => Category, { nullable: true })
  category?: Category;
}
