import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { Portfolio as PortfolioEntity } from '../entities/portfolio.entity';
import { PortfolioDetail } from '../entities/portfolio-detail.entity';
import { User } from '../../user/entities/user.entity';
import { PortfolioRepository } from '../../repositories/repos/portfolio.repository';
import { UpdatePortfolioDto } from '../dto/update-portfolio.dto';
import { LocaleCode } from '../enums/locale.enum';
import type { Portfolio } from '../interfaces/portfolio.interface';
import type { LocaleContent } from '../interfaces/locale-parts.interface';

@Injectable()
export class PortfoliosService {
  constructor(private readonly portfolioRepository: PortfolioRepository) {}

  private detailToLocaleContent(d: PortfolioDetail): LocaleContent {
    return {
      nav: d.nav,
      hero: d.hero,
      profile: d.profile,
      about: d.about,
      skills: d.skills,
      experience: d.experience,
      experiences: d.experiences,
      education: d.education,
      contact: d.contact,
      footer: d.footer,
    };
  }

  private buildLocalesFromDetails(
    p: PortfolioEntity,
    localeFilter?: LocaleCode,
  ): Portfolio['locales'] {
    const details = p.details || [];
    const toProcess = localeFilter
      ? details.filter((d) => d.locale === localeFilter)
      : details;
    const locales: Portfolio['locales'] = {
      [LocaleCode.En]: {} as LocaleContent,
      [LocaleCode.Vi]: {} as LocaleContent,
    };
    for (const d of toProcess) {
      locales[d.locale] = this.detailToLocaleContent(d);
    }
    return locales;
  }

  private toPortfolio(p: PortfolioEntity, localeFilter?: LocaleCode): Portfolio {
    return {
      id: p.id,
      slug: p.slug,
      email: p.email,
      phone: p.phone,
      dob: p.dob,
      skills: p.skills ?? [],
      isPublic: p.isPublic ?? true,
      locales: this.buildLocalesFromDetails(p, localeFilter),
    };
  }

  /** Returns portfolio by slug (public only). Optional locale filter. */
  async findBySlug(slug: string, locale?: LocaleCode): Promise<Portfolio> {
    const found = await this.portfolioRepository.findOneBySlugWithDetails(slug, locale);
    if (!found) {
      throw new NotFoundException(`Portfolio with slug "${slug}" not found`);
    }
    return this.toPortfolio(found, locale);
  }

  async findById(id: string): Promise<PortfolioEntity> {
    const found = await this.portfolioRepository.findOneById(id);
    if (!found) {
      throw new NotFoundException(`Portfolio with id "${id}" not found`);
    }
    return found;
  }

  async findMyPortfolio(user: User, locale?: LocaleCode): Promise<Portfolio | null> {
    const found = await this.portfolioRepository.findOneByUserIdWithDetails(user.id, locale);
    return found ? this.toPortfolio(found, locale) : null;
  }

  async update(id: string, dto: UpdatePortfolioDto, user: User): Promise<Portfolio> {
    const entity = await this.findById(id);
    if (entity.userId !== user.id) {
      throw new ForbiddenException('You can only update your own portfolio');
    }
    if (dto.slug !== undefined) {
      const exists = await this.portfolioRepository.findOneBySlug(dto.slug);
      if (exists && exists.id !== id) {
        throw new ConflictException(`Portfolio with slug "${dto.slug}" already exists`);
      }
    }
    await this.portfolioRepository.save({ ...entity, ...dto.toEntity() });
    const localesForSave = dto.getLocalesForSave();
    if (localesForSave !== undefined) {
      await this.portfolioRepository.deleteDetailsByPortfolioId(id);
      await this.portfolioRepository.saveDetailsFromLocales(id, localesForSave);
    }
    const withDetails = await this.portfolioRepository.findOneByIdWithDetails(id);
    if (!withDetails) {
      throw new NotFoundException(`Portfolio with id "${id}" not found`);
    }
    return this.toPortfolio(withDetails);
  }
}
