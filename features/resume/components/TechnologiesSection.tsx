import React from "react";
import { portfolioData } from "@/features/resume/data";
import { Language } from "@/shared/types/language";

type TechnologiesSectionProps = {
  title: string;
  language: Language;
};

export const TechnologiesSection = ({
  title,
  language,
}: TechnologiesSectionProps): React.JSX.Element => {
  const groups = [
    {
      category: "core",
      title:
        language === Language.FR
          ? "TECHNOLOGIES PRINCIPALES"
          : "CORE TECHNOLOGIES",
    },
    {
      category: "specialized",
      title:
        language === Language.FR
          ? "PLATEFORMES WEB SPÉCIALISÉES"
          : "SPECIALIZED WEB PLATFORMS",
    },
  ] as const;

  return (
    <section className="mb-4 sm:mb-5 print:mb-3">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 border-b-2 border-primary-500 pb-1 print:text-base print:mb-1">
        {title}
      </h2>
      <div className="space-y-1.5 print:space-y-1">
        {groups.map(({ category, title: groupTitle }) => {
          const technologies = portfolioData.technologies
            .filter((technology) => technology.category === category)
            .map((technology) => technology.name)
            .join(" · ");

          return (
            <div
              key={category}
              className="sm:flex sm:items-baseline sm:gap-3 print:flex print:items-baseline print:gap-2"
            >
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide shrink-0 mb-0.5 sm:mb-0 print:mb-0">
                {groupTitle}
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {technologies}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
