import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export default class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.userRepo
      .createQueryBuilder('u')
      .where('u.email = :email', { email })
      .getOne();
  }

  createUser(user: Partial<User>): Promise<User> {
    const newUser = this.userRepo.create(user);
    return this.userRepo.save(newUser);
  }
}
