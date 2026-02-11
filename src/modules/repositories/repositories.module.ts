import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Portfolio } from '../portfolios/entities/portfolio.entity';
import { PortfolioDetail } from '../portfolios/entities/portfolio-detail.entity';
import { UserRepository } from './repos/user.repository';
import { PortfolioRepository } from './repos/portfolio.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Portfolio, PortfolioDetail])],
  providers: [UserRepository, PortfolioRepository],
  exports: [UserRepository, PortfolioRepository],
})
export class RepositoriesModule {}
