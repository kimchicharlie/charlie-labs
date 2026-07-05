import React from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import { getLocalizedArray, getLocalizedContent } from "@/shared/i18n";
import { Language } from "@/shared/types/language";
import { portfolioData } from "@/features/resume/data";
import { fadeInUp, staggerChildren } from "@/features/resume/constants";

type ExperienceSectionProps = {
  title: string;
  technologiesLabel: string;
  language: Language;
};

export const ExperienceSection = ({
  title,
  technologiesLabel,
  language,
}: ExperienceSectionProps): React.JSX.Element => {
  return (
    <section className="mb-4 sm:mb-6 print:mb-3 avoid-page-break">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 border-b-2 border-primary-500 pb-1 print:text-base print:mb-2">
        {title}
      </h2>
      <motion.div
        className="space-y-3 sm:space-y-4 print:space-y-2"
        variants={staggerChildren}
        initial="initial"
        animate="animate"
      >
        {portfolioData.experience.map((experience) => (
          <motion.div
            key={`${experience.company}-${experience.period.en}`}
            variants={fadeInUp}
            className="border-l-4 border-primary-500 pl-4 pb-3 sm:pb-4 relative print:pb-2 print:pl-3 avoid-page-break"
          >
            <div className="absolute -left-2 top-0 w-3 h-3 bg-primary-500 rounded-full print:w-2 print:h-2 print:-left-1" />
            <div className="mb-1">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 print:text-xs">
                {getLocalizedContent(experience.title, language)}
              </h3>
              <p className="text-primary-600 font-medium text-xs sm:text-sm print:text-xs">
                {experience.company}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-xs text-gray-600 mt-1 print:text-xs location-date-container">
                <div className="flex items-center space-x-1 location-date-item">
                  <MapPin className="h-3 w-3 resume-icon" />
                  <span>
                    {getLocalizedContent(experience.location, language)}
                  </span>
                </div>
                <div className="flex items-center space-x-1 location-date-item">
                  <Calendar className="h-3 w-3 resume-icon" />
                  <span>
                    {getLocalizedContent(experience.period, language)}
                  </span>
                </div>
              </div>
            </div>

            {getLocalizedArray(experience.description, language).length > 0 && (
              <ul className="text-gray-700 space-y-0.5 print:text-xs print:space-y-0">
                {getLocalizedArray(experience.description, language).map(
                  (description) => (
                    <li
                      key={`${experience.company}-${description}`}
                      className="flex"
                    >
                      <span className="text-primary-500 mr-2 mt-0.5 print:mt-0 text-xs">
                        •
                      </span>
                      <span className="text-xs sm:text-sm print:text-xs flex-1">
                        {description}
                      </span>
                    </li>
                  ),
                )}
              </ul>
            )}

            {experience.technologies.length > 0 && (
              <div className="mt-2 print:mt-1">
                <p className="text-xs text-gray-600 mb-1 print:mb-0.5">
                  {technologiesLabel}
                </p>
                <div className="flex flex-wrap gap-1 print:gap-0.5">
                  {experience.technologies.map((technology) => (
                    <span
                      key={`${experience.company}-${technology}`}
                      className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs print:px-1 print:py-0 print:text-xs"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
