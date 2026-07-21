import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET ?? 'super-secret-key',
  expiration: (process.env.JWT_EXPIRATION ?? '15m') as any,
  refreshExpiration: (process.env.JWT_REFRESH_EXPIRATION ?? '7d') as any,
}));
