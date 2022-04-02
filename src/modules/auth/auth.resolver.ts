import { ForbiddenException, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CurrentRefreshToken } from 'src/decorators/current-refresh-token.decorator';
import { CurrentUserId } from 'src/decorators/current-user-id.decorator';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { LoginInput, LoginOutput } from 'src/modules/auth/dto/login.dto';
import { LogoutOutPut } from 'src/modules/auth/dto/logout.dto';
import { RefreshOutput } from 'src/modules/auth/dto/refresh.dto';
import {
  RegisterInput,
  RegisterOutput,
} from 'src/modules/auth/dto/register.dto';
import { RefreshTokenGuard } from 'src/modules/auth/guards/refresh-token.guard';
import { User } from 'src/modules/user/user.entity';
import { AuthService } from 'src/modules/auth/auth.service';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => RegisterOutput)
  @Public()
  async register(
    @Args('registerInput') registerInput: RegisterInput,
  ): Promise<RegisterOutput> {
    return await this.authService.register(registerInput);
  }

  @Mutation(() => LoginOutput)
  @Public()
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<LoginOutput> {
    return await this.authService.login(loginInput);
  }

  @Mutation(() => RefreshOutput)
  @Public()
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @CurrentUserId() userId: string,
    @CurrentRefreshToken() refreshToken: string,
  ): Promise<RefreshOutput> {
    return this.authService.refresh(userId, refreshToken);
  }

  @Mutation(() => LogoutOutPut)
  @Roles(['ANY'])
  async logout(@CurrentUserId() userId: string): Promise<LogoutOutPut> {
    return await this.authService.logout(userId);
  }
}
