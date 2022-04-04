import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, Length } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Restaurant } from './restaurant.entity';

@InputType('DishChoiceInputType', { isAbstract: true })
@ObjectType()
export class DishChoice {
  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => Int, { nullable: true })
  extra?: number;
}
@InputType('DishOptionInputType', { isAbstract: true })
@ObjectType()
export class DishOption {
  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => [DishChoice], { nullable: true })
  choices?: DishChoice[];

  @Field(() => Int, { nullable: true })
  extra?: number;
}
@InputType({ isAbstract: true })
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
  @Column({ type: 'json', nullable: true })
  options?: DishOption[];
}
