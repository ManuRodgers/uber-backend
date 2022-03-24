import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

export class UserRepository extends Repository<User> {}
