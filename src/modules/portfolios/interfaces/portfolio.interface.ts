import { LocaleCode } from '../enums/locale.enum';
import type { LocaleContent } from './locale-parts.interface';

export type { LocaleContent, ExperienceItem, ExperienceProject } from './locale-parts.interface';

/** Map of locale code to localized content */
export interface LocalesMap {
  [LocaleCode.En]: LocaleContent;
  [LocaleCode.Vi]: LocaleContent;
}

export interface Portfolio {
  id: string;
  slug: string;
  email: string;
  phone: string;
  dob: string;
  skills: string[];
  isPublic: boolean;
  locales: LocalesMap;
}
