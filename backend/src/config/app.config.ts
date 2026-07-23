import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  appName: process.env.APP_NAME ?? 'RentDecla API',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:4200',
  // corsOrigin: process.env.CORS_ORIGIN ?? 'http://192.168.1.77:4200'
}));
