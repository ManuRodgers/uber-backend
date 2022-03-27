import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import { RefreshTokenStrategy } from 'src/modules/auth/strategies/refresh-token.strategy';
import { User } from 'src/modules/user/user.entity';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthResolver } from 'src/modules/auth/auth.resolver';
import { UserModule } from 'src/modules/user/user.module';

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
