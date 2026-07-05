import React from "react";
import { Language } from "@/shared/types/language";
import { getLocalizedContent } from "@/shared/i18n";
import { portfolioData } from "@/features/resume/data";

type AboutSectionProps = {
  title: string;
  language: Language;
};

export const AboutSection = ({
  title,
  language,
}: AboutSectionProps): React.JSX.Element => {
  return (
    <section className="mb-4 sm:mb-5 print:mb-3">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 border-b-2 border-primary-500 pb-1 print:text-base print:mb-2">
        {title}
      </h2>
      <p className="text-gray-700 leading-relaxed text-sm print:text-xs">
        {getLocalizedContent(portfolioData.personalInfo.about, language)}
      </p>
    </section>
  );
};
