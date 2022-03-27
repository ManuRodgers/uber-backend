import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from 'src/modules/auth/auth.resolver';
import { AuthService } from 'src/modules/auth/auth.service';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthResolver, AuthService],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
