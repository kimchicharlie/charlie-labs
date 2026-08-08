import Link from "next/link";
import React from "react";
import { ArrowRight, Download } from "lucide-react";
import { downloadResume } from "@/features/resume/services/pdf";
import { DownloadType, PageFormat } from "@/features/resume/types";
import { Language } from "@/shared/types/language";
import Container from "@/shared/ui/Container";
import { HomeCopy } from "../translations";

type HeroProps = {
  copy: HomeCopy;
  language: Language;
};

const Hero = ({ copy, language }: HeroProps): React.JSX.Element => (
  <section className="py-16 sm:py-20 lg:py-24">
    <Container>
      <div className="max-w-5xl">
        <p className="text-2xl font-semibold tracking-[-0.025em] text-[#1b1d21] sm:text-[2rem]">
          Charlie Henin
        </p>
        <p className="mt-1.5 text-sm font-normal text-[#777b82]">
          {copy.location}
        </p>
        <h1 className="mt-5 text-balance text-4xl font-medium leading-[1.08] tracking-[-0.045em] text-[#1b1d21] sm:text-5xl lg:text-[3.75rem]">
          {copy.heroTitle}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[#62666d] sm:text-xl">
          {copy.heroDescription}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="#experience"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-4"
          >
            {copy.viewWork}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() =>
              downloadResume(PageFormat.LETTER, DownloadType.PDF, language)
            }
            className="inline-flex items-center gap-2 rounded-lg border border-[#d8d6d0] bg-white px-5 py-3 text-sm font-semibold text-[#35383e] transition-colors hover:border-[#b8b6af] hover:bg-[#fbfaf7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-4"
          >
            <Download className="h-4 w-4" />
            {copy.downloadResume}
          </button>
        </div>
      </div>
    </Container>
  </section>
);

export default Hero;
