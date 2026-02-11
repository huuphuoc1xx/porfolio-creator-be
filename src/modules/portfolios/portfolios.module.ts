import { Module } from '@nestjs/common';
import { PortfoliosController } from './controllers/portfolios.controller';
import { PortfoliosService } from './services/portfolios.service';
import { UserCreatedListener } from './listeners/user-created.listener';

@Module({
  controllers: [PortfoliosController],
  providers: [PortfoliosService, UserCreatedListener],
  exports: [PortfoliosService],
})
export class PortfoliosModule {}
