import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import UserRepository from '../../infrastructure/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../dto/register.dto';
import { AuthResponse } from '../../presentation/responses/auth.response';
import { ConfigService } from '@nestjs/config';
import { UserMapper } from '../../infrastructure/mappers/user.mapper';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { AUTH_MESSAGE } from 'src/common/constants/message.constant';

@Injectable()
export class AuthService {
  private readonly salt: number;
  private readonly accessExpire?: string;
  private readonly refreshToken?: string;

  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.salt = Number(configService.get('BCRYPT_SALT', 10));
    this.accessExpire = configService.get<string>('jwt.accessExpire');
    this.refreshToken = configService.get<string>('jwt.refreshToken');
  }
  private async generateToken(user): Promise<AuthResponse> {
    const payload = { sub: user.user_id, role: user.role };
    const access_token = await this.jwtService.sign(payload, {
      expiresIn: this.accessExpire,
    });
    const refresh_token = await this.jwtService.sign(payload, {
      expiresIn: this.refreshToken,
    });
    return {
      access_token,
      refresh_token,
      user: UserMapper.toResponse(user),
    };
  }
  async register(regisDto: RegisterDto): Promise<AuthResponse> {
    const exists = await this.userRepo.findByEmail(regisDto.email);
    if (exists) throw new ConflictException('Email alreay exists');

    const hashPassword = await bcrypt.hash(regisDto.password, this.salt);
    const regisUser = await this.userRepo.createUser({
      name: regisDto.name,
      email: regisDto.email,
      password: hashPassword,
    });

    return this.generateToken(regisUser);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const findUser = await this.userRepo.findByEmail(loginDto.email);
    if (!findUser)
      throw new UnauthorizedException(AUTH_MESSAGE.INVALID_CREDENTIALS);

    const isMatch = await bcrypt.compare(findUser.password, loginDto.password);
    if (!isMatch)
      throw new UnauthorizedException(AUTH_MESSAGE.INVALID_CREDENTIALS);

    return this.generateToken(findUser);
  }
}
