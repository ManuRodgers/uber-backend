import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonResponse } from 'src/common/CommonReponse';
import { User } from 'src/user/user.entity';

@ObjectType()
export class RefreshOutput extends CommonResponse {
  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => String, { nullable: true })
  refreshToken?: string;
}
