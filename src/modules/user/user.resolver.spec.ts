import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from 'src/modules/user/user.resolver';
import { UserService } from 'src/modules/user/user.service';

describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserResolver, UserService],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
