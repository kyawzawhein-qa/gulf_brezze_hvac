export type SiteSettingsDTO = {
  brandName: string;
  tagline: string;
  phone: string;
  phoneHref: string;
  serviceCities: string[];
  demoBadgeText: string;
  footerBlurb: string;
  heroImagePath: string;
  logoMarkPath: string;
  logoWordmarkPath: string;
  logoMarkWhitePath: string;
  logoWordmarkWhitePath: string;
  chatAvatarPath: string;
};

export type HeroDTO = {
  eyebrow: string;
  headline: string;
  subhead: string;
  primaryCta: string;
  secondaryCta: string;
};

export type CaptionDTO = { id: number; at: number; text: string; sortOrder: number };

export type ServiceDTO = {
  id: number;
  title: string;
  desc: string;
  badge: string;
  iconPath: string;
  sortOrder: number;
};

export type SectionDTO = {
  eyebrow: string;
  heading: string;
  subhead: string;
  areaTitle?: string;
  areaSubhead?: string;
};

export type HowStepDTO = {
  id: number;
  title: string;
  body: string;
  detail: string;
  sortOrder: number;
};

export type ReviewDTO = {
  id: number;
  name: string;
  city: string;
  text: string;
  stars: number;
  sortOrder: number;
};

export type StatDTO = {
  id: number;
  value: string;
  label: string;
  group: string;
  sortOrder: number;
};

export type FinalCtaDTO = {
  eyebrow: string;
  heading: string;
  body: string;
  primaryBtn: string;
  secondaryBtn: string;
  tertiaryBtn: string;
  footnote: string;
};

export type ChatIssueDTO = { id: string; label: string; sortOrder: number };
export type ChatSlotDTO = { id: string; label: string; note: string; sortOrder: number };

export type ChatDTO = {
  welcomeText: string;
  validZips: string[];
  launcherLabel: string;
  issues: ChatIssueDTO[];
  slots: ChatSlotDTO[];
};

export type DesignDTO = {
  navy: string;
  deep: string;
  teal: string;
  aqua: string;
  sky: string;
  foam: string;
  sand: string;
  coral: string;
  coralDark: string;
  slate: string;
  muted: string;
};

export type SiteContent = {
  settings: SiteSettingsDTO;
  hero: HeroDTO;
  captions: CaptionDTO[];
  servicesSection: SectionDTO;
  services: ServiceDTO[];
  howSection: SectionDTO;
  howSteps: HowStepDTO[];
  trustSection: SectionDTO;
  reviews: ReviewDTO[];
  heroStats: StatDTO[];
  trustStats: StatDTO[];
  finalCta: FinalCtaDTO;
  chat: ChatDTO;
  design: DesignDTO;
};
