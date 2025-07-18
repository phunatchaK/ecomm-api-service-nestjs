import { User } from '../../domain/entities/user.entity';

export class UserMapper {
  static toResponse(user: User) {
    return {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
