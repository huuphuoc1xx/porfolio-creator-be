import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { LocaleCode } from '../enums/locale.enum';
import type {
  NavContent,
  HeroContent,
  ProfileContent,
  AboutContent,
  SkillsContent,
  ExperienceContent,
  ExperienceItem,
  EducationContent,
  ContactContent,
} from '../interfaces/locale-parts.interface';

/** One row per (portfolio, locale). Each section stored as JSON. */
@Entity('portfolio_detail')
@Unique(['portfolioId', 'locale'])
export class PortfolioDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  portfolioId: string;

  @ManyToOne(() => Portfolio, (p) => p.details, { onDelete: 'CASCADE' })
  @JoinColumn()
  portfolio: Portfolio;

  @Column({ type: 'enum', enum: LocaleCode })
  locale: LocaleCode;

  @Column({ type: 'json', nullable: true })
  nav?: NavContent;

  @Column({ type: 'json', nullable: true })
  hero?: HeroContent;

  @Column({ type: 'json', nullable: true })
  profile?: ProfileContent;

  @Column({ type: 'json', nullable: true })
  about?: AboutContent;

  @Column({ type: 'json', nullable: true })
  skills?: SkillsContent;

  @Column({ type: 'json', nullable: true })
  experience?: ExperienceContent;

  @Column({ type: 'json', nullable: true })
  experiences?: ExperienceItem[];

  @Column({ type: 'json', nullable: true })
  education?: EducationContent;

  @Column({ type: 'json', nullable: true })
  contact?: ContactContent;

  @Column({ type: 'varchar', length: 500, nullable: true })
  footer?: string;
}
