"use client";

import React from "react";
import { useLanguage } from "@/shared/i18n";
import { Language } from "@/shared/types/language";

const LanguageToggle = (): React.JSX.Element => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex rounded-lg border border-[#d9d7d1] bg-white p-1" aria-label="Language">
      {([Language.EN, Language.FR] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 ${
            language === option
              ? "bg-primary-700 text-white"
              : "text-[#62666d] hover:text-[#1b1d21]"
          }`}
          aria-pressed={language === option}
          aria-label={option === Language.EN ? "Switch to English" : "Passer au français"}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;
