import { registerAs } from '@nestjs/config';

export const AUTH_CONFIG_KEY = 'AUTH';
export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
}

export const authConfig = registerAs<AuthConfig>(AUTH_CONFIG_KEY, () => ({
  jwtSecret: process.env.JWT_SECRET || 'portfolio-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
}));
