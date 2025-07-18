import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  accessExpire: process.env.JWT_ACCESS_EXPIRES,
  refreshToken: process.env.JWT_REFRESH_EXPIRES,
}));
