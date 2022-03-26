import { Context, Query, Resolver } from '@nestjs/graphql';
import { CurrentRefreshToken } from 'src/auth/decorators/current-refresh-token.decorator';
import { CurrentUserId } from 'src/auth/decorators/current-user-id.decorator';
import { UsersOutput } from 'src/user/dto/users.dto';
import { User } from 'src/user/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UsersOutput, { name: 'users' })
  async users(
    @CurrentUserId() userId: string,
    @Context() context: string,
  ): Promise<UsersOutput> {
    return await this.userService.users();
  }
}
