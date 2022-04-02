import { Field, ObjectType } from '@nestjs/graphql';
import { CommonResponse } from 'src/common/CommonResponse';
import { Restaurant } from '../entities/restaurant.entity';

@ObjectType()
export class MyRestaurantsOutput extends CommonResponse {
  @Field(() => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];
}
