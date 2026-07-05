export enum Language {
  EN = "en",
  FR = "fr",
}

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export interface TranslationKeys {
  // Navigation
  "nav.resume": string;

  // Header
  "header.resume": string;
  "header.downloadUS": string;
  "header.downloadA4": string;

  // Sections
  "section.about": string;
  "section.experience": string;
  "section.education": string;
  "section.technologies": string;
  "section.hobbies": string;

  // Tech categories
  "tech.frontend": string;
  "tech.backend": string;
  "tech.database": string;
  "tech.tools": string;
  "tech.other": string;

  // Common
  "common.technologies": string;
  "common.location": string;
  "common.period": string;
  "common.present": string;
}

export type Translations = Record<Language, TranslationKeys>;
