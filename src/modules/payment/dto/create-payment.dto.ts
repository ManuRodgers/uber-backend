import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonResponse } from 'src/common/CommonResponse';
import { Payment } from '../entities/payment.entity';

@InputType()
export class CreatePaymentInput extends PickType(Payment, [
  'transactionId',
  'restaurantId',
] as const) {}

@ObjectType()
export class CreatePaymentOutput extends CommonResponse {
  @Field(() => Payment, { nullable: true })
  payment?: Payment;
}
