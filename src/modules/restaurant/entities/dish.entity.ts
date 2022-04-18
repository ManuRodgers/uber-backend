import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, Length } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { DishOption } from './dish-option.entity';

import { Restaurant } from './restaurant.entity';

@InputType('DishInputType', { isAbstract: true })
@ObjectType()
@Entity({ name: 'dishes' })
export class Dish extends CommonEntity {
  @Field(() => String, { nullable: false })
  @Column({ nullable: false })
  @IsString()
  @Length(5)
  name!: string;

  @Field(() => Int, { nullable: false })
  @Column({ nullable: false })
  @IsNumber()
  price!: number;

  @Field(() => String, { nullable: false })
  @Column({ nullable: false })
  @IsString()
  photo!: string;

  @Field(() => String, { nullable: false })
  @Column({ nullable: false })
  @IsString()
  @Length(5, 140)
  description!: string;

  @Field(() => Restaurant, { nullable: false })
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menu, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  restaurant!: Restaurant;

  @Field(() => [DishOption], { nullable: true })
  @OneToMany(() => DishOption, (dishOption) => dishOption.dish, {
    nullable: true,
    cascade: true,
    eager: true,
  })
  options?: DishOption[];
}
