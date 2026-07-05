"use client";

import { useContext } from "react";
import { LanguageContextType } from "@/shared/types/language";
import { LanguageContext } from "./LanguageProvider";

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
};
