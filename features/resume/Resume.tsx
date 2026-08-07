"use client";

import React from "react";
import { Download } from "lucide-react";
import { useLanguage } from "@/shared/i18n";
import Container from "@/shared/ui/Container";
import { DownloadType, PageFormat } from "./types";
import { downloadResume } from "./services/pdf";
import {
  AboutSection,
  EducationSection,
  ExperienceSection,
  HobbiesSection,
  ResumeHeader,
  TechnologiesSection,
} from "./components";

const Resume = (): React.JSX.Element => {
  const { language, t } = useLanguage();

  return (
    <div className="site-canvas py-12 sm:py-16 lg:py-20">
      <Container className="max-w-5xl">
        <div className="no-print mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary-700">Charlie Henin</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-[#1b1d21] sm:text-5xl">
              {t("header.resume")}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => downloadResume(PageFormat.LETTER, DownloadType.PDF, language)}
              className="inline-flex items-center gap-2 rounded-lg border border-[#d8d6d0] bg-white px-4 py-2.5 text-sm font-semibold text-[#35383e] transition-colors hover:border-[#b8b6af] hover:bg-[#fbfaf7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
            >
              <Download className="h-4 w-4" />
              {t("header.downloadUS")}
            </button>
            <button
              type="button"
              onClick={() => downloadResume(PageFormat.A4, DownloadType.PDF, language)}
              className="inline-flex items-center gap-2 rounded-lg border border-[#d8d6d0] bg-white px-4 py-2.5 text-sm font-semibold text-[#35383e] transition-colors hover:border-[#b8b6af] hover:bg-[#fbfaf7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
            >
              <Download className="h-4 w-4" />
              {t("header.downloadA4")}
            </button>
          </div>
        </div>

        <article
          id="resume-content"
          data-language={language}
          className="overflow-hidden rounded-2xl border border-[#e1dfd9] bg-white shadow-[0_18px_55px_rgba(27,29,33,0.06)] print:rounded-none print:border-0 print:shadow-none"
        >
          <ResumeHeader language={language} />
          <div className="p-6 sm:p-9 lg:p-11 print:p-4">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 print:block">
              <AboutSection title={t("section.about")} language={language} />
              <TechnologiesSection title={t("section.technologies")} language={language} />
            </div>
            <ExperienceSection
              title={t("section.experience")}
              technologiesLabel={t("common.technologies")}
              language={language}
            />
            <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14 print:block">
              <EducationSection title={t("section.education")} language={language} />
              <HobbiesSection
                title={t("section.hobbies")}
                languagesTitle={t("section.languages")}
                language={language}
              />
            </div>
          </div>
        </article>
      </Container>
    </div>
  );
};

export default Resume;
