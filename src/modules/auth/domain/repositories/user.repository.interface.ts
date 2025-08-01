import { User } from '../entities/user.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(user: Partial<User>): Promise<User>;
}
