import { InternalServerErrorException } from '@nestjs/common';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { hash } from 'argon2';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { GraphQLEmailAddress } from 'graphql-scalars';
import { CommonEntity } from 'src/common/common.entity';
import { Restaurant } from 'src/modules/restaurant/entities/restaurant.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { Order } from '../order/entities/order.entity';
import { Payment } from '../payment/entities/payment.entity';

export enum UserRole {
  CLIENT = 'CLIENT',
  OWNER = 'OWNER',
  DELIVERY = 'DELIVERY',
}
registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity({ name: 'users' })
export class User extends CommonEntity {
  @Field(() => GraphQLEmailAddress, { nullable: false })
  @Column({ nullable: false, unique: true })
  @IsEmail()
  email!: string;

  @Column({ nullable: false, select: false })
  @IsString()
  password!: string;

  @Field(() => Boolean, { nullable: false })
  @Column({ nullable: false, default: false })
  @IsBoolean()
  verified!: boolean;

  @Field(() => UserRole, { nullable: false })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
    nullable: false,
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role!: UserRole;

  @Column({ nullable: true, select: false })
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @Field(() => [Restaurant], { nullable: true })
  @OneToMany(() => Restaurant, (restaurant) => restaurant.owner, {
    nullable: true,
    cascade: true,
  })
  restaurants?: Restaurant[];

  // being customer
  @Field(() => [Order], { nullable: true })
  @OneToMany(() => Order, (order) => order.customer, {
    nullable: true,
  })
  orders?: Order[];

  // being driver
  @Field(() => [Order], { nullable: true })
  @OneToMany(() => Order, (order) => order.driver, {
    nullable: true,
  })
  rides?: Order[];

  @Field(() => [Payment], { nullable: true })
  @OneToMany(() => Payment, (payment) => payment.user, {
    nullable: true,
    cascade: true,
    eager: true,
  })
  payments?: Payment[];

  @BeforeInsert()
  @BeforeUpdate()
  async hasPassword(): Promise<void> {
    try {
      if (this.password) {
        this.password = await hash(this.password);
      }
    } catch (error) {
      throw new InternalServerErrorException('Error hashing password');
    }
  }
}
