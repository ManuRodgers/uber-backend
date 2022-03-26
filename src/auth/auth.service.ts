import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, verify } from 'argon2';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { LoginInput, LoginOutput } from 'src/auth/dto/login.dto';
import { LogoutOutPut } from 'src/auth/dto/logout.dto';
import { RefreshOutput } from 'src/auth/dto/refresh.dto';
import { RegisterInput, RegisterOutput } from 'src/auth/dto/register.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(registerInput: RegisterInput): Promise<RegisterOutput> {
    try {
      const { email, password } = registerInput;
      //  1. Check if user exists
      const user = await this.userService.getUserByEmail(email);
      if (user) {
        throw new Error('User already exists');
      }
      const savedUser = await this.userRepository.save(
        this.userRepository.create({ email, password }),
      );
      const { accessToken, refreshToken } = await this.generateTokens(
        savedUser,
      );
      await this.updateRefreshToken(savedUser.id, refreshToken);
      return {
        ok: true,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      //  1. Check if user exists
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        throw new ForbiddenException('Bad credentials');
      }
      // 2. Check if password is correct
      const isPasswordCorrect = await this.comparePassword(user.id, password);
      if (!isPasswordCorrect) {
        throw new ForbiddenException('Bad credentials');
      }
      const { accessToken, refreshToken } = await this.generateTokens(user);
      await this.updateRefreshToken(user.id, refreshToken);
      return {
        ok: true,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async refresh(userId: string, refreshToken: string): Promise<RefreshOutput> {
    try {
      //  1. Check if user exists
      const user = await this.userService.getUserById(userId);
      if (!user || !user.refreshToken) {
        throw new ForbiddenException('Access denied');
      }
      // 2. Check if refresh token is correct
      const isRefreshTokenCorrect = await this.compareRefreshToken(
        user.id,
        refreshToken,
      );
      console.log('-> isRefreshTokenCorrect', isRefreshTokenCorrect);
      if (!isRefreshTokenCorrect) {
        throw new Error('Wrong Refresh Token');
      }
      const { accessToken, refreshToken: newRefreshToken } =
        await this.generateTokens(user);
      await this.updateRefreshToken(user.id, newRefreshToken);
      return {
        ok: true,
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async logout(userId: string): Promise<LogoutOutPut> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }
      await this.updateRefreshToken(userId, null);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  private async generateTokens({
    id,
    email,
  }: User): Promise<Pick<RegisterOutput, 'accessToken' | 'refreshToken'>> {
    const payload: JwtPayload = {
      sub: id,
      email,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.config.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    const uglyRefreshToken =
      refreshToken === null ? null : await hash(refreshToken);
    await this.userRepository.update(userId, {
      refreshToken: uglyRefreshToken,
    });
  }

  private async comparePassword(
    userId: string,
    password: string,
  ): Promise<boolean> {
    const { user_password } = await this.userService.getPasswordByUserId(
      userId,
    );
    return verify(user_password, password);
  }

  private async compareRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const user = await this.userService.getUserById(userId);
    return verify(user.refreshToken, refreshToken);
  }
}
