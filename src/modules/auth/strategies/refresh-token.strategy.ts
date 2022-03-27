import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { RefreshTokenPayload } from 'src/modules/auth/dto/refresh-token-payload.dto';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    jwtPayload: JwtPayload,
  ): Promise<RefreshTokenPayload> {
    const refreshToken = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();
    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

    return {
      ...jwtPayload,
      refreshToken,
    };
  }
}
