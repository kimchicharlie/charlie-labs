import { Language } from "@/shared/types/language";
import { PageFormat } from "@/features/resume/types";

type ResumeSections = {
  headerSection?: HTMLElement;
  aboutSection?: HTMLElement;
  technologiesSection?: HTMLElement;
  experienceSection?: HTMLElement;
  educationSection?: HTMLElement;
  hobbiesSection?: HTMLElement;
};

const hasText = (
  element: HTMLElement | null,
  textMatchers: string[],
): boolean => {
  const heading = element?.querySelector("h2");
  const content = heading?.textContent?.toLowerCase() || "";

  return textMatchers.some((matcher) => content.includes(matcher));
};

export const createResumeFileName = (
  format: PageFormat,
  language: Language,
): string => {
  const formatSuffix = format === PageFormat.LETTER ? "US-Letter" : "A4";
  const languageSuffix = language === Language.FR ? "FR" : "EN";

  return `charlie-henin-resume-${formatSuffix}-${languageSuffix}`;
};

export const findResumeSections = (element: HTMLElement): ResumeSections => {
  const headerSection = element.querySelector(
    ".bg-gradient-to-r",
  ) as HTMLElement | null;
  const sections = Array.from(
    element.querySelectorAll("section"),
  ) as HTMLElement[];

  const aboutSection = sections.find((section) =>
    hasText(section, ["about", "propos", "à propos"]),
  );
  const experienceSection = sections.find((section) =>
    hasText(section, ["experience", "expérience"]),
  );
  const educationSection = sections.find((section) =>
    hasText(section, ["education", "éducation", "formation"]),
  );
  const technologiesSection = sections.find((section) =>
    hasText(section, ["technolog", "compétenc", "technologies"]),
  );
  const hobbiesSection = sections.find((section) =>
    hasText(section, ["hobbies", "loisir", "centres d'intérêt", "passions"]),
  );

  return {
    headerSection: headerSection || undefined,
    aboutSection,
    technologiesSection,
    experienceSection,
    educationSection,
    hobbiesSection,
  };
};
