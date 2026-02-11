import { registerAs } from '@nestjs/config';

export const DB_CONFIG_KEY = 'DB_CONFIG';

export interface DbConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
}

export const dbConfig = registerAs<DbConfig>(DB_CONFIG_KEY, () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
}));