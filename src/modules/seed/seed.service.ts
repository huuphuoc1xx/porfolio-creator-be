import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/services/user.service';
import { PortfolioRepository } from '../repositories/repos/portfolio.repository';
import { defaultPortfolio } from '../portfolios/data/seed.data';
import type { LocaleContent } from '../portfolios/interfaces/locale-parts.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService {
  private readonly seedEmail: string;
  private readonly seedPassword: string;
  constructor(
    private readonly userService: UserService,
    private readonly portfolioRepository: PortfolioRepository,
    configService: ConfigService,
  ) {
    this.seedEmail = configService.get<string>('SEED_EMAIL') || '';
    this.seedPassword = configService.get<string>('SEED_PASSWORD') || '';
  }

  async run(): Promise<void> {
    const existingUser = await this.userService.findByEmail(this.seedEmail);
    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      console.log(`Seed: User ${this.seedEmail} already exists, updating portfolio.`);
    } else {
      const passwordHash = await bcrypt.hash(this.seedPassword, 10);
      const user = await this.userService.createUser(this.seedEmail, passwordHash);
      userId = user.id;
      console.log(`Seed: Created user ${this.seedEmail}.`);
      await this.portfolioRepository.createDefaultForUser(user.id, user.email);
      console.log(`Seed: Created default portfolio.`);
    }

    const portfolio = await this.portfolioRepository.findOneByUserId(userId);
    if (!portfolio) {
      console.warn('Seed: No portfolio found for user, skipping content update.');
      return;
    }

    await this.portfolioRepository.save({
      ...portfolio,
      slug: defaultPortfolio.slug,
      email: defaultPortfolio.email,
      phone: defaultPortfolio.phone,
      dob: defaultPortfolio.dob,
      skills: defaultPortfolio.skills ?? [],
      isPublic: defaultPortfolio.isPublic ?? true,
    });

    const locales: { en: LocaleContent; vi: LocaleContent } = {
      en: defaultPortfolio.locales.en ?? ({} as LocaleContent),
      vi: defaultPortfolio.locales.vi ?? ({} as LocaleContent),
    };
    await this.portfolioRepository.saveDetailsFromLocales(portfolio.id, locales);
    console.log(`Seed: Portfolio content updated (slug: ${defaultPortfolio.slug}).`);
  }
}
