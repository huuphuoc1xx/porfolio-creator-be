import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { User } from '../../user/entities/user.entity';
import { PortfolioRepository } from '../../repositories/repos/portfolio.repository';
import { USER_CREATED } from '../../../events/events';

@Injectable()
export class UserCreatedListener {
  constructor(private readonly portfolioRepository: PortfolioRepository) {}

  @OnEvent(USER_CREATED)
  async handleUserCreated(payload: { user: User }): Promise<void> {
    const { user } = payload;
    await this.portfolioRepository.createDefaultForUser(user.id, user.email);
  }
}
