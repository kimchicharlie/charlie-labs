import React from "react";
import { portfolioData } from "@/features/resume/data";
import { getLocalizedContent } from "@/shared/i18n";
import { Language } from "@/shared/types/language";

type HobbiesSectionProps = { title: string; languagesTitle: string; language: Language };

export const HobbiesSection = ({ title, languagesTitle, language }: HobbiesSectionProps): React.JSX.Element => (
  <section className="mb-10 border-t border-[#e4e2dc] pt-9 print:mb-3 print:pt-2">
    <div className="space-y-7 print:grid print:grid-cols-2 print:gap-4 print:space-y-0">
      <div>
        <h2 className="text-lg font-semibold tracking-[-0.015em] text-[#1b1d21] print:text-base">{languagesTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-[#565a61] print:mt-1 print:text-xs">{getLocalizedContent(portfolioData.languages, language)}</p>
      </div>
      <div>
        <h2 className="text-lg font-semibold tracking-[-0.015em] text-[#1b1d21] print:text-base">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-[#565a61] print:mt-1 print:text-xs">{getLocalizedContent(portfolioData.interests, language)}</p>
      </div>
    </div>
  </section>
);
