import { Field, ObjectType } from '@nestjs/graphql';
import { CommonResponse } from 'src/common/CommonResponse';

@ObjectType()
export class LogoutOutPut extends CommonResponse {}
