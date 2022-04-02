import { Field, ObjectType } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql/dist/extra/graphql-model-shim';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { Restaurant } from 'src/modules/restaurant/entities/restaurant.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
@Entity({ name: 'categories' })
export class Category extends CommonEntity {
  @Field(() => String, { nullable: false })
  @Column({ nullable: false, unique: true })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Field(() => String, { nullable: false })
  @Column({ nullable: false, unique: true })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @Field(() => [Restaurant], { nullable: true })
  @OneToMany(() => Restaurant, (restaurant) => restaurant.category, {
    nullable: true,
  })
  @IsOptional()
  restaurants?: Restaurant[];
}
