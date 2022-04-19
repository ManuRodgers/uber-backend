import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import {
  CreatePaymentInput,
  CreatePaymentOutput,
} from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly userService: UserService,
  ) {}
  async createPayment(
    ownerId: string,
    { transactionId, restaurantId }: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    try {
      const restaurant = await this.restaurantRepository.findOneBy({
        id: restaurantId,
      });
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }
      if (restaurant.ownerId !== ownerId) {
        throw new Error(
          'You are not allowed to create a payment for this restaurant',
        );
      }
      const owner = await this.userService.getUserById(ownerId);
      if (!owner) {
        throw new Error('Owner not found');
      }
      const payment = await this.paymentRepository.save(
        this.paymentRepository.create({
          transactionId,
          restaurant,
          user: owner,
        }),
      );
      return {
        ok: true,
        payment,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
