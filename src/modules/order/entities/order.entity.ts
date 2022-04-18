import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsNumber, IsUUID } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { Dish } from 'src/modules/restaurant/entities/dish.entity';
import { Restaurant } from 'src/modules/restaurant/entities/restaurant.entity';
import { User } from 'src/modules/user/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm';

export enum OrderStatus {
  PENDING = 'PENDING',
  COOKING = 'COOKING',
  COOKED = 'COOKED',
  PICKEDUP = 'PICKEDUP',
  DELIVERED = 'DELIVERED',
}
registerEnumType(OrderStatus, { name: 'OrderStatus' });

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity({ name: 'orders' })
export class Order extends CommonEntity {
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.orders, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  customer?: User;

  @RelationId((order: Order) => order.customer)
  @IsUUID()
  customerId?: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.rides, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  driver?: User;

  @RelationId((order: Order) => order.driver)
  @IsUUID()
  driverId?: string;

  @Field(() => Restaurant, { nullable: true })
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  restaurant?: Restaurant;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  @IsNumber()
  total?: number;

  @Field(() => OrderStatus, { nullable: false })
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    nullable: false,
  })
  @IsEnum(OrderStatus)
  status!: OrderStatus;

  @Field(() => [Dish], { nullable: true })
  @ManyToMany(() => Dish, {
    nullable: false,
    cascade: true,
    eager: true,
  })
  @JoinTable()
  dishes!: Dish[];
}
