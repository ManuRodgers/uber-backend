import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersOutput } from 'src/modules/user/dto/users.dto';
import { User } from 'src/modules/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async users(): Promise<UsersOutput> {
    try {
      const users = await this.usersRepository.find();
      return { ok: true, users };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.usersRepository.findOne({
        where: { email },
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      return await this.usersRepository.findOne({
        where: { id: userId },
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getPasswordByUserId(
    userId: string,
  ): Promise<{ user_password: string } | null> {
    try {
      return await this.usersRepository
        .createQueryBuilder('user')
        .select('user.password', 'user_password')
        .where('user.id = :userId', { userId })
        .getRawOne();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getRefreshTokenByUserId(
    userId: string,
  ): Promise<{ user_refreshToken: string } | null> {
    try {
      return await this.usersRepository
        .createQueryBuilder('user')
        .select('user.refreshToken', 'user_refreshToken')
        .where('user.id = :userId', { userId })
        .getRawOne();
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
