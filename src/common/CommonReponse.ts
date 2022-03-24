import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommonResponse {
  @Field(() => Boolean, {
    nullable: false,
  })
  ok!: boolean;

  @Field(() => String, {
    nullable: true,
  })
  error?: string;
}
