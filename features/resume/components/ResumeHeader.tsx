import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Globe, Linkedin, Github, Music2 } from "lucide-react";
import { getLocalizedContent } from "@/shared/i18n";
import { Language } from "@/shared/types/language";
import { portfolioData } from "@/features/resume/data";
import { fadeInUp, staggerChildren } from "@/features/resume/constants";

type ResumeHeaderProps = {
  language: Language;
  pitchGameLabel: string;
};

export const ResumeHeader = ({
  language,
  pitchGameLabel,
}: ResumeHeaderProps): React.JSX.Element => {
  return (
    <motion.div
      className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 sm:p-6 print:bg-gray-900"
      {...fadeInUp}
    >
      <div className="text-center">
        <motion.h1
          className="text-2xl sm:text-3xl font-bold mb-1 tracking-wide"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {portfolioData.personalInfo.name}
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg text-gray-300 mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {getLocalizedContent(portfolioData.personalInfo.title, language)}
        </motion.p>
        <motion.p
          className="text-sm text-gray-400 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          {getLocalizedContent(portfolioData.personalInfo.location, language)}
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          <motion.a
            href={`mailto:${portfolioData.contact.email}`}
            variants={fadeInUp}
            className="flex items-center space-x-2 hover:text-primary-300 transition-colors"
          >
            <Mail className="h-4 w-4 resume-icon" />
            <span>{portfolioData.contact.email}</span>
          </motion.a>
          <motion.a
            href={`https://${portfolioData.contact.website}`}
            target="_blank"
            rel="noopener noreferrer"
            variants={fadeInUp}
            className="flex items-center space-x-2 hover:text-primary-300 transition-colors"
          >
            <Globe className="h-4 w-4 resume-icon" />
            <span>{portfolioData.contact.website}</span>
          </motion.a>
          <motion.a
            href={`https://www.linkedin.com/in/${portfolioData.contact.linkedin}/`}
            target="_blank"
            rel="noopener noreferrer"
            variants={fadeInUp}
            className="flex items-center space-x-2 hover:text-primary-300 transition-colors"
          >
            <Linkedin className="h-4 w-4 resume-icon" />
            <span>{portfolioData.contact.linkedin}</span>
          </motion.a>
          <motion.a
            href={`https://github.com/${portfolioData.contact.github}`}
            target="_blank"
            rel="noopener noreferrer"
            variants={fadeInUp}
            className="flex items-center space-x-2 hover:text-primary-300 transition-colors"
          >
            <Github className="h-4 w-4 resume-icon" />
            <span>{portfolioData.contact.github}</span>
          </motion.a>
        </motion.div>

        <motion.div
          className="mt-5 no-print"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
        >
          <Link
            href="/pitch-game/"
            className="inline-flex items-center gap-2 rounded-full border border-primary-300/30 bg-primary-400/10 px-4 py-2 text-sm font-medium text-primary-200 transition hover:border-primary-300/60 hover:bg-primary-400/20 hover:text-white"
          >
            <Music2 className="h-4 w-4" />
            {pitchGameLabel}
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};
