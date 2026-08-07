import React from "react";
import { Github, Globe, Linkedin, Mail, MapPin } from "lucide-react";
import { getLocalizedContent } from "@/shared/i18n";
import { Language } from "@/shared/types/language";
import { portfolioData } from "@/features/resume/data";

type ResumeHeaderProps = {
  language: Language;
};

export const ResumeHeader = ({ language }: ResumeHeaderProps): React.JSX.Element => (
  <header className="border-b border-[#e4e2dc] px-6 py-8 sm:px-9 sm:py-10 lg:px-11 print:bg-gray-900 print:p-4 print:text-white">
    <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <h2 className="text-3xl font-semibold tracking-[-0.035em] text-[#1b1d21] sm:text-4xl print:text-xl print:text-white">
          {portfolioData.personalInfo.name}
        </h2>
        <p className="mt-2 text-base font-medium text-primary-700 print:text-base print:text-white">
          {getLocalizedContent(portfolioData.personalInfo.title, language)}
        </p>
        <p className="mt-3 flex items-center gap-2 text-sm text-[#777b82] print:mt-1 print:text-xs print:text-white">
          <MapPin className="h-4 w-4 resume-icon" />
          {getLocalizedContent(portfolioData.personalInfo.location, language)}
        </p>
      </div>

      <div className="grid gap-2 text-sm sm:grid-cols-2 md:text-right print:grid-cols-4 print:text-xs">
        <a className="inline-flex items-center gap-2 text-[#565a61] transition-colors hover:text-primary-700 md:justify-end print:text-white" href={`mailto:${portfolioData.contact.email}`}>
          <Mail className="h-4 w-4 resume-icon" />
          {portfolioData.contact.email}
        </a>
        <a className="inline-flex items-center gap-2 text-[#565a61] transition-colors hover:text-primary-700 md:justify-end print:text-white" href={`https://${portfolioData.contact.website}`} target="_blank" rel="noopener noreferrer">
          <Globe className="h-4 w-4 resume-icon" />
          {portfolioData.contact.website}
        </a>
        <a className="inline-flex items-center gap-2 text-[#565a61] transition-colors hover:text-primary-700 md:justify-end print:text-white" href={`https://www.linkedin.com/in/${portfolioData.contact.linkedin}/`} target="_blank" rel="noopener noreferrer">
          <Linkedin className="h-4 w-4 resume-icon" />
          {portfolioData.contact.linkedin}
        </a>
        <a className="inline-flex items-center gap-2 text-[#565a61] transition-colors hover:text-primary-700 md:justify-end print:text-white" href={`https://github.com/${portfolioData.contact.github}`} target="_blank" rel="noopener noreferrer">
          <Github className="h-4 w-4 resume-icon" />
          {portfolioData.contact.github}
        </a>
      </div>
    </div>
  </header>
);
