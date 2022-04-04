import { Field, ObjectType } from '@nestjs/graphql';
import { CommonResponse } from 'src/common/CommonResponse';

@ObjectType()
export class RefreshOutput extends CommonResponse {
  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => String, { nullable: true })
  refreshToken?: string;
}
