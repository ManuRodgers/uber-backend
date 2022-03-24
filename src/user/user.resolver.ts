import { Query, Resolver } from '@nestjs/graphql';
import { UsersOutput } from 'src/user/dto/users.dto';
import { User } from 'src/user/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UsersOutput, { name: 'users' })
  async users(): Promise<UsersOutput> {
    return await this.userService.users();
  }
}
