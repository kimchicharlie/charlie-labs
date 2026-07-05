"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { useLanguage } from "@/shared/i18n";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <motion.div
        className="fixed top-20 sm:top-24 right-2 sm:right-4 z-50 flex flex-col space-y-2 no-print"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.button
          onClick={() =>
            downloadResume(PageFormat.LETTER, DownloadType.PDF, language)
          }
          className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-lg text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Download as PDF (US Letter)"
        >
          <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">PDF (US)</span>
          <span className="sm:hidden">PDF US</span>
        </motion.button>
        <motion.button
          onClick={() =>
            downloadResume(PageFormat.A4, DownloadType.PDF, language)
          }
          className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 shadow-lg text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Download as PDF (A4)"
        >
          <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">PDF (A4)</span>
          <span className="sm:hidden">PDF A4</span>
        </motion.button>
      </motion.div>

      <div className="max-w-6xl mx-auto p-0 sm:p-4 md:p-6">
        <motion.div
          id="resume-content"
          data-language={language}
          className="bg-white rounded-none sm:rounded-lg shadow-none sm:shadow-lg overflow-hidden print:shadow-none print:rounded-none print:max-w-none print:w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ResumeHeader language={language} />

          <div className="p-4 sm:p-6 print:p-4">
            <AboutSection title={t("section.about")} language={language} />
            <TechnologiesSection title={t("section.technologies")} t={t} />
            <ExperienceSection
              title={t("section.experience")}
              technologiesLabel={t("common.technologies")}
              language={language}
            />
            <EducationSection
              title={t("section.education")}
              language={language}
            />
            <HobbiesSection title={t("section.hobbies")} language={language} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Resume;
