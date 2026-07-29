import React from "react";
import { motion } from "framer-motion";
import { portfolioData } from "@/features/resume/data";
import { getLocalizedContent } from "@/shared/i18n";
import { Language } from "@/shared/types/language";

type HobbiesSectionProps = {
  title: string;
  languagesTitle: string;
  language: Language;
};

export const HobbiesSection = ({
  title,
  languagesTitle,
  language,
}: HobbiesSectionProps): React.JSX.Element => {
  const languages = getLocalizedContent(portfolioData.languages, language);
  const interests = getLocalizedContent(portfolioData.interests, language);

  return (
    <motion.section
      className="mb-4 sm:mb-6 print:mb-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 border-b-2 border-primary-500 pb-1 print:text-base print:mb-1">
            {languagesTitle}
          </h2>
          <p className="text-sm text-gray-700 print:text-xs">{languages}</p>
        </div>
        <div className="sm:border-l sm:border-gray-200 sm:pl-4 print:border-l print:border-gray-200 print:pl-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 border-b-2 border-primary-500 pb-1 print:text-base print:mb-1">
            {title}
          </h2>
          <p className="text-sm text-gray-700 print:text-xs">{interests}</p>
        </div>
      </div>
    </motion.section>
  );
};
