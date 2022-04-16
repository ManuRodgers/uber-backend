import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/common/common.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Dish } from './dish.entity';

@InputType('DishOptionInputType', { isAbstract: true })
@ObjectType()
@Entity({ name: 'dish_options' })
export class DishOption extends CommonEntity {
  @Field(() => String, { nullable: false })
  @Column({ nullable: false })
  name!: string;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @Column({ nullable: true })
  extra?: number;

  @Field(() => Dish, { nullable: true })
  @ManyToOne(() => Dish, (dish) => dish.options, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  dish?: Dish;
}
