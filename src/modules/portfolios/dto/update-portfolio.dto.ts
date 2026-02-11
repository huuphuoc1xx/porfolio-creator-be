import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsArray, IsObject, IsBoolean, IsOptional, MinLength, Matches } from 'class-validator';
import type { LocaleContent } from '../interfaces/locale-parts.interface';

export class UpdatePortfolioDto {
  @ApiPropertyOptional({ example: 'nguyen-huu-phuoc' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @Matches(/^[a-z0-9-]+$/, { message: 'slug must be lowercase letters, numbers and hyphens only' })
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dob?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({ description: 'If true, portfolio is visible in list and by slug to everyone' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ description: 'Localized content for en and vi' })
  @IsOptional()
  @IsObject()
  locales?: {
    en?: LocaleContent;
    vi?: LocaleContent;
  };

  toEntity(): Partial<{
    slug: string;
    email: string;
    phone: string;
    dob: string;
    skills: string[];
    isPublic: boolean;
  }> {
    const out: Partial<{
      slug: string;
      email: string;
      phone: string;
      dob: string;
      skills: string[];
      isPublic: boolean;
    }> = {};
    if (this.slug !== undefined) out.slug = this.slug;
    if (this.email !== undefined) out.email = this.email;
    if (this.phone !== undefined) out.phone = this.phone;
    if (this.dob !== undefined) out.dob = this.dob;
    if (this.skills !== undefined) out.skills = this.skills;
    if (this.isPublic !== undefined) out.isPublic = this.isPublic;
    return out;
  }

  /** Normalized locales for saveDetailsFromLocales; undefined if locales not provided. */
  getLocalesForSave(): { en: LocaleContent; vi: LocaleContent } | undefined {
    if (this.locales === undefined) return undefined;
    return {
      en: this.locales.en ?? ({} as LocaleContent),
      vi: this.locales.vi ?? ({} as LocaleContent),
    };
  }
}
