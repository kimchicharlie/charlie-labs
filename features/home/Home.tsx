"use client";

import React from "react";
import { useLanguage } from "@/shared/i18n";
import { About, Experiences, Hero, Projects } from "./components";
import { homeTranslations } from "./translations";

const Home = (): React.JSX.Element => {
  const { language } = useLanguage();
  const copy = homeTranslations[language];

  return (
    <div className="bg-[#f7f6f2]">
      <Hero copy={copy} language={language} />
      <Experiences copy={copy} language={language} />
      <Projects copy={copy} />
      <About copy={copy} />
    </div>
  );
};

export default Home;
