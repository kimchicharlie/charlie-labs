import React from "react";
import { portfolioData } from "@/features/resume/data";
import { Language } from "@/shared/types/language";

type TechnologiesSectionProps = { title: string; language: Language };

export const TechnologiesSection = ({ title, language }: TechnologiesSectionProps): React.JSX.Element => {
  const groups = [
    { category: "core", label: language === Language.FR ? "Principales" : "Core" },
    { category: "specialized", label: language === Language.FR ? "Plateformes spécialisées" : "Specialized platforms" },
  ] as const;

  return (
    <section className="mb-10 print:mb-3">
      <h2 className="text-lg font-semibold tracking-[-0.015em] text-[#1b1d21] print:text-base">{title}</h2>
      <dl className="mt-4 space-y-4 print:mt-1 print:space-y-1">
        {groups.map(({ category, label }) => (
          <div key={category}>
            <dt className="text-xs font-medium uppercase tracking-[0.08em] text-[#858990] print:text-xs">{label}</dt>
            <dd className="mt-1.5 text-sm leading-6 text-[#4f5359] print:mt-0 print:text-xs">
              {portfolioData.technologies.filter((technology) => technology.category === category).map((technology) => technology.name).join(" · ")}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
