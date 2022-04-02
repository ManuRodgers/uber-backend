import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonResponse } from 'src/common/CommonResponse';
import { User } from 'src/modules/user/user.entity';

@InputType()
export class LoginInput extends PickType(User, ['email'] as const) {
  @Field(() => String, { nullable: false })
  password!: string;
}

@ObjectType()
export class LoginOutput extends CommonResponse {
  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => String, { nullable: true })
  refreshToken?: string;
}
