import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Portfolio as PortfolioEntity } from '../../portfolios/entities/portfolio.entity';
import { PortfolioDetail } from '../../portfolios/entities/portfolio-detail.entity';
import { LocaleCode } from '../../portfolios/enums/locale.enum';
import type { LocaleContent } from '../../portfolios/interfaces/locale-parts.interface';

@Injectable()
export class PortfolioRepository {
  constructor(
    @InjectRepository(PortfolioEntity)
    private readonly repo: Repository<PortfolioEntity>,
    @InjectRepository(PortfolioDetail)
    private readonly detailRepo: Repository<PortfolioDetail>,
  ) {}

  async findOneBySlugWithDetails(
    slug: string,
    locale?: LocaleCode,
  ): Promise<PortfolioEntity | null> {
    const qb = this.repo
      .createQueryBuilder('portfolio')
      .leftJoinAndSelect(
        'portfolio.details',
        'details',
        locale ? 'details.locale = :locale' : '1=1',
        locale ? { locale } : {},
      )
      .where('portfolio.slug = :slug', { slug })
      .andWhere('(portfolio.isPublic = :public OR portfolio.isPublic IS NULL)', {
        public: true,
      });
    return qb.getOne();
  }

  async findOneById(id: string): Promise<PortfolioEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findOneByIdWithDetails(
    id: string,
    locale?: LocaleCode,
  ): Promise<PortfolioEntity | null> {
    const qb = this.repo
      .createQueryBuilder('portfolio')
      .leftJoinAndSelect(
        'portfolio.details',
        'details',
        locale ? 'details.locale = :locale' : '1=1',
        locale ? { locale } : {},
      )
      .where('portfolio.id = :id', { id });
    return qb.getOne();
  }

  async findOneByUserIdWithDetails(
    userId: string,
    locale?: LocaleCode,
  ): Promise<PortfolioEntity | null> {
    const qb = this.repo
      .createQueryBuilder('portfolio')
      .leftJoinAndSelect(
        'portfolio.details',
        'details',
        locale ? 'details.locale = :locale' : '1=1',
        locale ? { locale } : {},
      )
      .where('portfolio.userId = :userId', { userId })
      .orderBy('portfolio.createdAt', 'DESC');
    return qb.getOne();
  }

  async findOneBySlug(slug: string): Promise<PortfolioEntity | null> {
    return this.repo.findOne({ where: { slug } });
  }

  async findOneByUserId(userId: string): Promise<PortfolioEntity | null> {
    return this.repo.findOne({ where: { userId } });
  }

  /** Create the single default portfolio for a new user. Slug is unique per user. */
  async createDefaultForUser(userId: string, email: string): Promise<PortfolioEntity> {
    const slug = `u-${userId.replace(/-/g, '').slice(0, 20)}`;
    const entity = this.repo.create({
      userId,
      slug,
      email,
      phone: '',
      dob: '',
      skills: [],
      isPublic: true,
    });
    const saved = await this.repo.save(entity);
    const emptyLocale = {} as LocaleContent;
    await this.saveDetailsFromLocales(saved.id, { en: emptyLocale, vi: emptyLocale });
    return saved;
  }

  create(attrs: Partial<PortfolioEntity>): PortfolioEntity {
    return this.repo.create(attrs);
  }

  async save(portfolio: PortfolioEntity): Promise<PortfolioEntity> {
    return this.repo.save(portfolio);
  }

  async remove(portfolio: PortfolioEntity): Promise<void> {
    await this.repo.remove(portfolio);
  }

  async saveDetailsFromLocales(
    portfolioId: string,
    locales: { en: LocaleContent; vi: LocaleContent },
  ): Promise<void> {
    await this.detailRepo.delete({ portfolioId });

    const saveOne = async (locale: LocaleCode, raw: LocaleContent) => {
      const partial: DeepPartial<PortfolioDetail> = {
        portfolioId,
        locale,
        nav: raw.nav ?? undefined,
        hero: raw.hero ?? undefined,
        profile: raw.profile ?? undefined,
        about: raw.about ?? undefined,
        skills: raw.skills ?? undefined,
        experience: raw.experience ?? undefined,
        experiences: raw.experiences ?? undefined,
        education: raw.education ?? undefined,
        contact: raw.contact ?? undefined,
        footer: raw.footer ?? undefined,
      };
      const entity = this.detailRepo.create(partial);
      await this.detailRepo.save(entity);
    };

    await saveOne(LocaleCode.En, locales.en ?? ({} as LocaleContent));
    await saveOne(LocaleCode.Vi, locales.vi ?? ({} as LocaleContent));
  }

  async deleteDetailsByPortfolioId(portfolioId: string): Promise<void> {
    await this.detailRepo.delete({ portfolioId });
  }
}
