"use client";

import React, { createContext, ReactNode, useMemo, useState } from "react";
import { Language, LanguageContextType } from "@/shared/types/language";
import { translations } from "./translations";

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider = ({
  children,
}: LanguageProviderProps): React.JSX.Element => {
  const [language, setLanguage] = useState<Language>(Language.EN);

  const value = useMemo<LanguageContextType>(() => {
    const t = (key: string): string => {
      const translatedValue =
        translations[language][
          key as keyof (typeof translations)[typeof language]
        ];
      return translatedValue || key;
    };

    return {
      language,
      setLanguage,
      t,
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
