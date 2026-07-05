import React from "react";
import { portfolioData } from "@/features/resume/data";

type TechnologiesSectionProps = {
  title: string;
  t: (key: string) => string;
};

const categories = ["frontend", "backend", "database", "tools", "other"];

export const TechnologiesSection = ({
  title,
  t,
}: TechnologiesSectionProps): React.JSX.Element => {
  return (
    <section className="mb-4 sm:mb-6 print:mb-3">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 border-b-2 border-primary-500 pb-1 print:text-base print:mb-2">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 print:grid-cols-2 print:gap-4">
        {categories.map((category) => {
          const technologies = portfolioData.technologies.filter(
            (technology) => technology.category === category,
          );

          if (technologies.length === 0) {
            return null;
          }

          return (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide print:text-xs">
                {t(`tech.${category}`)}
              </h3>
              <div className="flex flex-wrap gap-1 print:gap-0.5">
                {technologies.map((technology) => (
                  <span
                    key={technology.name}
                    className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs print:px-1 print:py-0.5 print:text-xs"
                  >
                    {technology.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
