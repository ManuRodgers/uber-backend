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

export enum UserRole {
  CLIENT = 'CLIENT',
  OWNER = 'OWNER',
  DELIVERY = 'DELIVERY',
}
registerEnumType(UserRole, { name: 'UserRole' });

@InputType({ isAbstract: true })
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
