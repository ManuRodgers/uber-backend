import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonResponse } from 'src/common/CommonReponse';
import { User } from 'src/modules/user/user.entity';

@InputType()
export class RegisterInput extends PickType(User, ['email'] as const) {
  @Field(() => String, { nullable: false })
  password!: string;
}

@ObjectType()
export class RegisterOutput extends CommonResponse {
  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => String, { nullable: true })
  refreshToken?: string;
}
