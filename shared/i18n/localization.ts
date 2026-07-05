import { Language } from "@/shared/types/language";
import {
  LocalizedContent,
  LocalizedStringArray,
} from "@/shared/types/portfolio";

export const getLocalizedContent = (
  content: LocalizedContent,
  language: Language,
): string => {
  return content[language];
};

export const getLocalizedArray = (
  content: LocalizedStringArray,
  language: Language,
): string[] => {
  return content[language];
};
