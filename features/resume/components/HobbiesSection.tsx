import React from "react";
import { motion } from "framer-motion";
import { getLocalizedContent } from "@/shared/i18n";
import { Language } from "@/shared/types/language";
import { portfolioData } from "@/features/resume/data";

type HobbiesSectionProps = {
  title: string;
  language: Language;
};

export const HobbiesSection = ({
  title,
  language,
}: HobbiesSectionProps): React.JSX.Element => {
  return (
    <motion.section
      className="mb-4 sm:mb-6 print:mb-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
    >
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 border-b-2 border-primary-500 pb-1 print:text-base print:mb-2">
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 print:grid-cols-4 print:gap-2">
        {portfolioData.hobbies.map((hobby) => (
          <motion.div
            key={hobby.icon}
            className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors print:p-1 print:bg-transparent hobby-item"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            title={getLocalizedContent(hobby.name, language)}
          >
            <span className="text-lg print:text-sm hobby-icon flex-shrink-0">
              {hobby.icon}
            </span>
            <span className="text-xs text-gray-700 print:text-xs hobby-text">
              {getLocalizedContent(hobby.name, language)}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
