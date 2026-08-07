import React from "react";
import { Calendar, MapPin } from "lucide-react";
import { getLocalizedArray, getLocalizedContent } from "@/shared/i18n";
import { Language } from "@/shared/types/language";
import { portfolioData } from "@/features/resume/data";

type ExperienceSectionProps = {
  title: string;
  technologiesLabel: string;
  language: Language;
};

export const ExperienceSection = ({ title, technologiesLabel, language }: ExperienceSectionProps): React.JSX.Element => (
  <section className="mb-10 border-t border-[#e4e2dc] pt-9 print:mb-3 print:pt-2 avoid-page-break">
    <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#1b1d21] print:text-base">{title}</h2>
    <div className="mt-6 divide-y divide-[#e4e2dc] print:mt-1 print:space-y-2 print:divide-y-0">
      {portfolioData.experience.map((experience) => (
        <article key={`${experience.company}-${experience.period.en}`} className="grid gap-4 py-7 first:pt-0 sm:grid-cols-[11rem_1fr] sm:gap-8 print:block print:py-0 print:pb-2 avoid-page-break">
          <div className="space-y-2 text-xs text-[#777b82] print:text-xs">
            <p className="flex items-center gap-1.5 location-date-item">
              <Calendar className="h-3.5 w-3.5 resume-icon" />
              {getLocalizedContent(experience.period, language)}
            </p>
            <p className="flex items-center gap-1.5 location-date-item">
              <MapPin className="h-3.5 w-3.5 resume-icon" />
              {getLocalizedContent(experience.location, language)}
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#1b1d21] print:text-xs">
              {getLocalizedContent(experience.title, language)}
            </h3>
            <p className="mt-1 text-sm font-medium text-primary-700 print:mt-0 print:text-xs">{experience.company}</p>

            <ul className="mt-3 space-y-1.5 print:mt-1 print:space-y-0">
              {getLocalizedArray(experience.description, language).map((description) => (
                <li key={`${experience.company}-${description}`} className="flex gap-2 text-sm leading-6 text-[#565a61] print:text-xs">
                  <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#9ba0a6] print:mt-1.5" />
                  <span>{description}</span>
                </li>
              ))}
            </ul>

            {experience.technologies.length > 0 && (
              <div className="mt-4 print:mt-1">
                <p className="text-xs text-[#858990] print:text-xs">{technologiesLabel}</p>
                <div className="mt-2 flex flex-wrap gap-1.5 print:mt-0 print:gap-0.5">
                  {experience.technologies.map((technology) => (
                    <span key={`${experience.company}-${technology}`} className="rounded-md bg-[#f2f3f4] px-2 py-1 font-mono text-[10px] text-[#565a61] print:bg-white print:px-1 print:py-0 print:text-xs">
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  </section>
);
