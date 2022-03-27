import { Field, ObjectType } from '@nestjs/graphql';
import { CommonResponse } from 'src/common/CommonReponse';

@ObjectType()
export class LogoutOutPut extends CommonResponse {}
