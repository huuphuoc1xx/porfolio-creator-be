import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entities/user.entity';
import { Portfolio } from './modules/portfolios/entities/portfolio.entity';
import { PortfolioDetail } from './modules/portfolios/entities/portfolio-detail.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from './modules/auth/auth.module';
import { PortfoliosModule } from './modules/portfolios/portfolios.module';
import { RepositoriesModule } from './modules/repositories/repositories.module';
import { UserModule } from './modules/user/user.module';
import { SeedModule } from './modules/seed/seed.module';
import { DB_CONFIG_KEY, DbConfig, dbConfig } from './config/db.config';
import { AppConfig, appConfig } from './config/app.config';
import { authConfig } from './config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [dbConfig, appConfig, authConfig] }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const db = config.get<DbConfig>(DB_CONFIG_KEY);
        if (!db) {
          throw new Error('DB_CONFIG is not loaded. Check ConfigModule load array.');
        }
        return {
          type: 'mysql' as const,
          ...db,
          entities: [User, Portfolio, PortfolioDetail],
          migrations: ['dist/migrations/*.js'],
          namingStrategy: new SnakeNamingStrategy(),
          synchronize: db.synchronize,
        };
      },
      inject: [ConfigService],
    }),
    RepositoriesModule,
    UserModule,
    AuthModule,
    PortfoliosModule,
    SeedModule,
  ],
})
export class AppModule {}
