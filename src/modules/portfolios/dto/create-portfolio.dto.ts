import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsArray,
  IsObject,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  MinLength,
  Matches,
} from 'class-validator';
import type { LocaleContent } from '../interfaces/locale-parts.interface';

export class CreatePortfolioDto {
  @ApiProperty({ example: 'nguyen-huu-phuoc', description: 'URL-friendly unique slug' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @Matches(/^[a-z0-9-]+$/, { message: 'slug must be lowercase letters, numbers and hyphens only' })
  slug: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '0335659631' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '28-08-1999' })
  @IsString()
  @IsNotEmpty()
  dob: string;

  @ApiProperty({ example: ['Node.js', 'React', 'TypeScript'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @ApiProperty({ default: true, description: 'If true, portfolio is visible in list and by slug to everyone' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({
    description: 'Localized content for en and vi',
    example: {
      en: { nav: {}, hero: {}, profile: {}, about: {}, skills: {}, experience: {}, experiences: [], education: {}, contact: {}, footer: '' },
      vi: {},
    },
  })
  @IsObject()
  @IsNotEmpty()
  locales: {
    en: LocaleContent;
    vi: LocaleContent;
  };

  toEntity(userId: string): Pick<CreatePortfolioDto, 'slug' | 'email' | 'phone' | 'dob' | 'skills'> & {
    userId: string;
    isPublic: boolean;
  } {
    return {
      slug: this.slug,
      userId,
      email: this.email,
      phone: this.phone,
      dob: this.dob,
      skills: this.skills ?? [],
      isPublic: this.isPublic !== false,
    };
  }
}
