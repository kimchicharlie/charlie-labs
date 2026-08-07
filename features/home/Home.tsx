"use client";

import Link from "next/link";
import React from "react";
import { ArrowRight, Download } from "lucide-react";
import { getLocalizedContent, useLanguage } from "@/shared/i18n";
import Container from "@/shared/ui/Container";
import { portfolioData } from "@/features/resume/data";
import { downloadResume } from "@/features/resume/services/pdf";
import { DownloadType, PageFormat } from "@/features/resume/types";
import { PitchGamePreview } from "@/features/pitch-game/components";
import { homeTranslations } from "./translations";

const selectedCompanies = ["STINGRAY", "BOTPRESS", "BELLMAN", "SIGFOX"];
const projectTags = ["React", "TypeScript", "Web Audio API", "AudioWorklet"];

const Home = (): React.JSX.Element => {
  const { language } = useLanguage();
  const copy = homeTranslations[language];
  const selectedExperience = selectedCompanies
    .map((company) =>
      portfolioData.experience.find((item) => item.company === company),
    )
    .filter(
      (item): item is (typeof portfolioData.experience)[number] =>
        Boolean(item),
    );

  return (
    <div className="bg-[#f7f6f2]">
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="max-w-5xl">
            <p className="text-2xl font-semibold tracking-[-0.025em] text-[#1b1d21] sm:text-[2rem]">
              Charlie Henin
            </p>
            <p className="mt-1.5 text-sm font-normal text-[#777b82]">
              {copy.location}
            </p>
            <h1 className="mt-5 text-balance text-4xl font-medium leading-[1.08] tracking-[-0.045em] text-[#1b1d21] sm:text-5xl lg:text-[3.75rem]">
              {copy.heroTitle}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#62666d] sm:text-xl">
              {copy.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#experience"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-4"
              >
                {copy.viewWork}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() =>
                  downloadResume(
                    PageFormat.LETTER,
                    DownloadType.PDF,
                    language,
                  )
                }
                className="inline-flex items-center gap-2 rounded-lg border border-[#d8d6d0] bg-white px-5 py-3 text-sm font-semibold text-[#35383e] transition-colors hover:border-[#b8b6af] hover:bg-[#fbfaf7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-4"
              >
                <Download className="h-4 w-4" />
                {copy.downloadResume}
              </button>
            </div>
          </div>
        </Container>
      </section>

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
              {selectedExperience.map((experience) => (
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

      <section id="work" className="border-t border-[#e4e2dc] py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-semibold tracking-[-0.025em] text-[#1b1d21] sm:text-3xl">
            {copy.projectsExperiments}
          </h2>

          <article className="mt-8 grid min-w-0 items-center gap-8 border-y border-[#e1dfd9] py-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(20rem,1.08fr)] lg:gap-12">
            <PitchGamePreview
              alt={copy.projectImageAlt}
              className="rounded-xl border border-[#d8dce1]"
              priority
            />

            <div className="min-w-0 max-w-xl">
              <p className="text-xs font-medium text-[#777b82]">
                {copy.projectMetadata}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-[#1b1d21]">
                Pitch Matching Game
              </h3>
              <p className="mt-4 text-base leading-7 text-[#62666d]">
                {copy.projectDescription}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {projectTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#ebecef] px-2.5 py-1 font-mono text-[10px] font-medium text-[#565a61]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/pitch-game/"
                  className="inline-flex items-center rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-4"
                >
                  {copy.playGame}
                </Link>
                <Link
                  href="/pitch-game/case-study/"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-900"
                >
                  {copy.projectDetails}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        </Container>
      </section>

      <section
        id="about"
        className="border-t border-[#e4e2dc] bg-white py-20 sm:py-24"
      >
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.31fr)_minmax(0,0.69fr)] lg:gap-12 xl:gap-16">
            <div>
              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#1b1d21] sm:text-4xl">
                {copy.about}
              </h2>
            </div>
            <div className="max-w-2xl space-y-5 text-lg leading-8 text-[#51555c]">
              {copy.aboutParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p className="text-base text-[#777b82]">{copy.personalNote}</p>
            </div>
          </div>

          <div className="mt-16 border-t border-[#e4e2dc] pt-10">
            <h3 className="text-lg font-semibold text-[#1b1d21]">
              {copy.technologies}
            </h3>
            <dl className="mt-6 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <dt className="text-sm font-medium text-[#777b82]">
                  {copy.core}
                </dt>
                <dd className="mt-2 leading-7 text-[#35383e]">
                  TypeScript · React · Next.js · Node.js
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-[#777b82]">
                  {copy.platforms}
                </dt>
                <dd className="mt-2 leading-7 text-[#35383e]">
                  Web Audio API · AudioWorklet · Service Workers · WebAssembly
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-[#777b82]">
                  {copy.infrastructure}
                </dt>
                <dd className="mt-2 leading-7 text-[#35383e]">
                  AWS · GCP · Docker · Kubernetes
                </dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      <section className="bg-[#17324d] py-20 text-white sm:py-24">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              {copy.contactTitle}
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#cbd8e5]">
              {copy.contactDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold">
              <a
                className="transition-colors hover:text-[#bdd4e7]"
                href={`mailto:${portfolioData.contact.email}`}
              >
                Email
              </a>
              <a
                className="transition-colors hover:text-[#bdd4e7]"
                href={`https://www.linkedin.com/in/${portfolioData.contact.linkedin}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                className="transition-colors hover:text-[#bdd4e7]"
                href={`https://github.com/${portfolioData.contact.github}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;
