import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUserId } from 'src/decorators/current-user-id.decorator';
import { Roles } from 'src/decorators/role.decorator';
import {
  CreatePaymentInput,
  CreatePaymentOutput,
} from './dto/create-payment.dto';

import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => CreatePaymentOutput)
  @Roles(['OWNER'])
  async createPayment(
    @CurrentUserId() ownerId: string,
    @Args('createPaymentInput') createPaymentInput: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    return this.paymentService.createPayment(ownerId, createPaymentInput);
  }
}
