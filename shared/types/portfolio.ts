export interface ContactInfo {
  phone: string;
  email: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface Technology {
  name: string;
  category: "frontend" | "backend" | "database" | "tools" | "other";
}

export interface LocalizedContent {
  en: string;
  fr: string;
}

export interface LocalizedStringArray {
  en: string[];
  fr: string[];
}

export interface Experience {
  title: LocalizedContent;
  company: string;
  location: LocalizedContent;
  period: LocalizedContent;
  description: LocalizedStringArray;
  technologies: string[];
  type: "full-time" | "contract" | "internship";
}

export interface Education {
  degree: LocalizedContent;
  institution: string;
  location: LocalizedContent;
  period: LocalizedContent;
  description: LocalizedStringArray;
  achievements?: LocalizedStringArray;
}

export interface Hobby {
  name: LocalizedContent;
  icon: string;
}

export interface PortfolioData {
  personalInfo: {
    name: string;
    title: LocalizedContent;
    about: LocalizedContent;
  };
  contact: ContactInfo;
  experience: Experience[];
  education: Education[];
  technologies: Technology[];
  hobbies: Hobby[];
}
