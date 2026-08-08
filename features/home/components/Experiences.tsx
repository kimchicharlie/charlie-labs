import Link from "next/link";
import React from "react";
import { ArrowRight } from "lucide-react";
import { portfolioData } from "@/features/resume/data";
import { getLocalizedContent } from "@/shared/i18n";
import { Language } from "@/shared/types/language";
import Container from "@/shared/ui/Container";
import { HomeCopy } from "../translations";

const selectedCompanies = ["STINGRAY", "BOTPRESS", "BELLMAN", "SIGFOX"];

type ExperiencesProps = {
  copy: HomeCopy;
  language: Language;
};

const Experiences = ({
  copy,
  language,
}: ExperiencesProps): React.JSX.Element => {
  const selectedExperiences = selectedCompanies
    .map((company) =>
      portfolioData.experience.find((item) => item.company === company),
    )
    .filter(
      (item): item is (typeof portfolioData.experience)[number] =>
        Boolean(item),
    );

  return (
    <section
      id="experience"
      className="border-t border-[#e4e2dc] bg-white py-20 sm:py-24"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.31fr)_minmax(0,0.69fr)] lg:gap-12 xl:gap-16">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#1b1d21] sm:text-4xl">
              {copy.selectedExperience}
            </h2>
            <Link
              href="/resume/"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-900"
            >
              {copy.viewFullResume}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="min-w-0 divide-y divide-[#e4e2dc] border-y border-[#e4e2dc]">
            {selectedExperiences.map((experience) => (
              <article
                key={experience.company}
                className="grid min-w-0 gap-3 py-7 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-7"
              >
                <div>
                  <h3 className="text-sm font-semibold text-[#1b1d21]">
                    {experience.company}
                  </h3>
                  <p className="mt-1 text-sm text-[#777b82]">
                    {getLocalizedContent(experience.period, language)}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-[#35383e]">
                    {getLocalizedContent(experience.title, language)}
                  </p>
                  <p className="mt-2 break-words text-sm leading-6 text-[#656970]">
                    {copy.experienceDescriptions[experience.company]}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Experiences;
