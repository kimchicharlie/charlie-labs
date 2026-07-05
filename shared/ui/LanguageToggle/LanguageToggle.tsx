"use client";

import React from "react";
import { motion } from "framer-motion";
import { Languages } from "lucide-react";
import { useLanguage } from "@/shared/i18n";
import { Language } from "@/shared/types/language";

const LanguageToggle = (): React.JSX.Element => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLanguage: Language): void => {
    setLanguage(newLanguage);
  };

  return (
    <div className="flex items-center space-x-2">
      <Languages className="h-4 w-4 text-gray-600" />
      <div className="flex bg-gray-100 rounded-lg p-1">
        <motion.button
          onClick={() => handleLanguageChange(Language.EN)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
            language === Language.EN
              ? "bg-white text-primary-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
          whileTap={{ scale: 0.95 }}
        >
          EN
        </motion.button>
        <motion.button
          onClick={() => handleLanguageChange(Language.FR)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
            language === Language.FR
              ? "bg-white text-primary-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
          whileTap={{ scale: 0.95 }}
        >
          FR
        </motion.button>
      </div>
    </div>
  );
};

export default LanguageToggle;
