import { Field, ObjectType } from '@nestjs/graphql';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';

@ObjectType()
export class RefreshTokenPayload extends JwtPayload {
  @Field(() => String, { nullable: false })
  refreshToken!: string;
}
