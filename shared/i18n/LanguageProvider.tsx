"use client";

import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
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

  useEffect(() => {
    const requestedLanguage = new URLSearchParams(window.location.search).get(
      "lang",
    );

    if (requestedLanguage === Language.FR) {
      setLanguage(Language.FR);
    }
  }, []);

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
