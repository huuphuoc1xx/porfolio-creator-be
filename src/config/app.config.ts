import { registerAs } from '@nestjs/config';

export const APP_CONFIG_KEY = 'APP';

export interface AppConfig {
  port: number;
  nodeEnv: string;
  /** Comma-separated origins for CORS (e.g. http://localhost:10002). Empty = allow all in dev. */
  corsOrigins: string[];
}

export const appConfig = registerAs<AppConfig>(APP_CONFIG_KEY, () => {
  const raw = process.env.APP_CORS_ORIGINS ?? '';
  const corsOrigins = raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : [];
  return {
    port: parseInt(process.env.PORT || '10001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigins,
  };
});
