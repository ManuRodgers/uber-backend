import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { UserModule } from '../user/user.module';
import { Payment } from './entities/payment.entity';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Restaurant]), UserModule],
  providers: [PaymentResolver, PaymentService],
})
export class PaymentModule {}
