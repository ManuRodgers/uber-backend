import { User } from 'src/modules/user/user.entity';
import { Repository } from 'typeorm';

export class UserRepository extends Repository<User> {}
