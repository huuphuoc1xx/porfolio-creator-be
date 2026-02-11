/** Nav section keys. Fields may be undefined; FE handles as needed. */
export interface NavContent {
  home?: string;
  about?: string;
  skills?: string;
  experience?: string;
  education?: string;
  contact?: string;
  login?: string;
  logout?: string;
}

/** Hero section */
export interface HeroContent {
  greeting?: string;
  title?: string;
  summary?: string;
  contact?: string;
  viewExperience?: string;
}

/** Profile block */
export interface ProfileContent {
  name?: string;
  summary?: string;
  address?: string;
}

/** About section labels */
export interface AboutContent {
  title?: string;
  email?: string;
  phone?: string;
  address?: string;
  dob?: string;
}

/** Skills section */
export interface SkillsContent {
  title?: string;
}

/** Experience section headers */
export interface ExperienceContent {
  title?: string;
  team?: string;
}

/** Single project inside an experience */
export interface ExperienceProject {
  name?: string;
  description?: string;
  teamSize?: string;
  responsibilities?: string[];
  tech?: string[];
}

/** Single job/experience entry */
export interface ExperienceItem {
  company?: string;
  role?: string;
  period?: string;
  projects?: ExperienceProject[];
}

/** Education section */
export interface EducationContent {
  title?: string;
  school?: string;
  major?: string;
  period?: string;
  gpa?: string;
}

/** Contact section */
export interface ContactContent {
  title?: string;
  intro?: string;
  email?: string;
  phone?: string;
}

/** Full locale content for one language */
export interface LocaleContent {
  nav?: NavContent;
  hero?: HeroContent;
  profile?: ProfileContent;
  about?: AboutContent;
  skills?: SkillsContent;
  experience?: ExperienceContent;
  experiences?: ExperienceItem[];
  education?: EducationContent;
  contact?: ContactContent;
  footer?: string;
}
