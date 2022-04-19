import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { Restaurant } from 'src/modules/restaurant/entities/restaurant.entity';
import { User } from 'src/modules/user/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@InputType('PaymentInputType', { isAbstract: true })
@ObjectType()
@Entity({ name: 'payments' })
export class Payment extends CommonEntity {
  @Field(() => String, { nullable: false })
  @Column({ nullable: false })
  @IsString()
  transactionId!: string;

  @Field(() => User, { nullable: false })
  @ManyToOne(() => User, (user) => user.payments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user!: User;

  @RelationId((payment: Payment) => payment.user)
  userId: string;

  @Field(() => Restaurant, { nullable: false })
  @ManyToOne(() => Restaurant, { nullable: false })
  restaurant!: Restaurant;

  @Field(() => String, { nullable: true })
  @RelationId((payment: Payment) => payment.restaurant)
  restaurantId: string;
}
