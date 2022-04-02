import { Context, Query, Resolver } from '@nestjs/graphql';
import { CurrentRefreshToken } from 'src/decorators/current-refresh-token.decorator';
import { CurrentUserId } from 'src/decorators/current-user-id.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { UsersOutput } from 'src/modules/user/dto/users.dto';
import { User } from 'src/modules/user/user.entity';
import { UserService } from 'src/modules/user/user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UsersOutput, { name: 'users' })
  @Roles(['ANY'])
  async users(
    @CurrentUserId() userId: string,
    @Context() context: string,
  ): Promise<UsersOutput> {
    return await this.userService.users();
  }
}
