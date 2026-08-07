import React from "react";
import { Language } from "@/shared/types/language";
import { getLocalizedContent } from "@/shared/i18n";
import { portfolioData } from "@/features/resume/data";

type AboutSectionProps = { title: string; language: Language };

export const AboutSection = ({ title, language }: AboutSectionProps): React.JSX.Element => (
  <section className="mb-10 print:mb-3">
    <h2 className="text-lg font-semibold tracking-[-0.015em] text-[#1b1d21] print:text-base">{title}</h2>
    <p className="mt-4 text-[15px] leading-7 text-[#565a61] print:mt-1 print:text-xs">
      {getLocalizedContent(portfolioData.personalInfo.about, language)}
    </p>
  </section>
);
