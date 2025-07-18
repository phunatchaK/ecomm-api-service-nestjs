import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from '../../application/dto/register.dto';
import { AuthService } from '../../application/services/auth.service';
import { ApiResponse } from 'src/common/dto/response.dto';
import { AuthResponse } from '../responses/auth.response';
import { LoginDto } from '../../application/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerController(
    @Body() registerDto: RegisterDto,
  ): Promise<ApiResponse<AuthResponse>> {
    const result = await this.authService.register(registerDto);
    return ApiResponse.success(result, 'Register Sucessful');
  }

  @Post('login')
  async loginController(
    @Body() loginDto: LoginDto,
  ): Promise<ApiResponse<AuthResponse>> {
    const result = await this.authService.login(loginDto);
    return ApiResponse.success(result, 'Login Successful');
  }
}
