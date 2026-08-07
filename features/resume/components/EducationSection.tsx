import React from "react";
import { Calendar, MapPin } from "lucide-react";
import { getLocalizedArray, getLocalizedContent } from "@/shared/i18n";
import { Language } from "@/shared/types/language";
import { portfolioData } from "@/features/resume/data";

type EducationSectionProps = { title: string; language: Language };

export const EducationSection = ({ title, language }: EducationSectionProps): React.JSX.Element => (
  <section className="mb-10 border-t border-[#e4e2dc] pt-9 print:mb-3 print:pt-2 avoid-page-break">
    <h2 className="text-lg font-semibold tracking-[-0.015em] text-[#1b1d21] print:text-base">{title}</h2>
    <div className="mt-5 divide-y divide-[#e4e2dc] print:mt-1 print:space-y-2 print:divide-y-0">
      {portfolioData.education.map((education) => (
        <article key={`${education.institution}-${education.period.en}`} className="py-5 first:pt-0 print:py-0 print:pb-2 avoid-page-break">
          <h3 className="text-sm font-semibold text-[#1b1d21] print:text-xs">{getLocalizedContent(education.degree, language)}</h3>
          <p className="mt-1 text-sm font-medium text-primary-700 print:mt-0 print:text-xs">{education.institution}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#777b82] print:mt-0 print:text-xs location-date-container">
            <span className="flex items-center gap-1.5 location-date-item"><MapPin className="h-3.5 w-3.5 resume-icon" />{getLocalizedContent(education.location, language)}</span>
            <span className="flex items-center gap-1.5 location-date-item"><Calendar className="h-3.5 w-3.5 resume-icon" />{getLocalizedContent(education.period, language)}</span>
          </div>
          <ul className="mt-3 space-y-1 print:mt-1 print:space-y-0">
            {getLocalizedArray(education.description, language).map((description) => (
              <li key={`${education.institution}-${description}`} className="flex gap-2 text-sm leading-6 text-[#565a61] print:text-xs">
                <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#9ba0a6] print:mt-1.5" />
                {description}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  </section>
);
