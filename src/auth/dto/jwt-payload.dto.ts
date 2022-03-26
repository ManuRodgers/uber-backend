import { Field, Int, ObjectType, PickType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';

@ObjectType()
export class JwtPayload extends PickType(User, ['email'] as const) {
  @Field(() => String, { nullable: false })
  sub!: string;

  @Field(() => Int, { nullable: true })
  iat?: number;

  @Field(() => Int, { nullable: true })
  exp?: number;
}
