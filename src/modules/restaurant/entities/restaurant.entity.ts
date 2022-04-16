import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { User } from 'src/modules/user/user.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';

import { Category } from './category.entity';
import { Dish } from './dish.entity';

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity({ name: 'restaurants' })
export class Restaurant extends CommonEntity {
  @Field(() => String, { nullable: false })
  @Column({ nullable: false })
  @IsString()
  name!: string;

  @Field(() => String, { nullable: false })
  @Column({ nullable: false })
  @IsString()
  address!: string;

  @Field(() => String, { nullable: false })
  @Column({ nullable: false })
  @IsString()
  coverImage!: string;

  @Field(() => Boolean, { nullable: false, defaultValue: false })
  @Column({ nullable: false, default: false })
  isPromoted!: boolean;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  promotedUntil?: Date;

  @Field(() => User, { nullable: false })
  @ManyToOne(() => User, (user) => user.restaurants, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  owner!: User;

  @RelationId((restaurant: Restaurant) => restaurant.owner)
  @IsUUID()
  ownerId!: string;

  @Field(() => [Dish], { nullable: false })
  @OneToMany(() => Dish, (dish) => dish.restaurant, {
    nullable: false,
    cascade: true,
  })
  menu!: Dish[];

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category?: Category;

  @Field(() => [Order], { nullable: true })
  @OneToMany(() => Order, (order) => order.restaurant, {
    nullable: true,
  })
  orders?: Order[];
}
