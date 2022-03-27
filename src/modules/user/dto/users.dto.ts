import { Field, ObjectType } from '@nestjs/graphql';
import { CommonResponse } from 'src/common/CommonReponse';
import { User } from 'src/modules/user/user.entity';

@ObjectType()
export class UsersOutput extends CommonResponse {
  @Field(() => [User], { nullable: true })
  users?: User[];
}
