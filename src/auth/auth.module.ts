import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { RefreshTokenStrategy } from 'src/auth/strategies/refresh-token.strategy';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    UserModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthResolver, AuthService, JwtStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
