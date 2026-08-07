"use client";

import Link from "next/link";
import React from "react";
import { ArrowRight, Play } from "lucide-react";
import { useLanguage } from "@/shared/i18n";
import Container from "@/shared/ui/Container";
import { PitchGamePreview } from "./components";
import { projectTranslations } from "./projectTranslations";

const ProjectDetails = (): React.JSX.Element => {
  const { language } = useLanguage();
  const copy = projectTranslations[language];

  return (
    <article className="bg-[#f7f6f2] py-16 sm:py-24">
      <Container>
        <header className="max-w-4xl">
          <p className="text-sm font-semibold text-primary-700">{copy.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#1b1d21] sm:text-5xl lg:text-6xl">
            Pitch Matching Game
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#62666d] sm:text-xl">{copy.description}</p>
          <Link
            href="/pitch-game/"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-4"
          >
            <Play className="h-4 w-4 fill-current" />
            {copy.play}
          </Link>
        </header>

        <div className="mt-14 rounded-2xl border border-[#d8dce1] bg-[#eef1f4] p-3 sm:p-5">
          <PitchGamePreview
            alt={copy.imageAlt}
            className="rounded-xl border border-[#d8dce1]"
          />
        </div>

        <dl className="mt-12 grid gap-7 border-y border-[#e4e2dc] py-8 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-[#777b82]">{copy.roleLabel}</dt>
            <dd className="mt-2 font-medium text-[#35383e]">{copy.role}</dd>
          </div>
          <div>
            <dt className="text-sm text-[#777b82]">{copy.typeLabel}</dt>
            <dd className="mt-2 font-medium text-[#35383e]">{copy.type}</dd>
          </div>
          <div>
            <dt className="text-sm text-[#777b82]">{copy.stackLabel}</dt>
            <dd className="mt-2 font-medium text-[#35383e]">React · TypeScript · Web Audio API</dd>
          </div>
        </dl>

        <div className="mx-auto mt-16 max-w-3xl space-y-16 sm:mt-20">
          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.025em] text-[#1b1d21]">{copy.whatTitle}</h2>
            <p className="mt-4 text-base leading-7 text-[#565a61]">{copy.whatBody}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.025em] text-[#1b1d21]">{copy.featuresTitle}</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {copy.features.map((feature) => (
                <li key={feature} className="rounded-xl border border-[#e4e2dc] bg-white px-4 py-4 text-sm leading-6 text-[#51555c]">
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.025em] text-[#1b1d21]">{copy.howTitle}</h2>
            <p className="mt-4 text-base leading-7 text-[#565a61]">{copy.howBody}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.025em] text-[#1b1d21]">{copy.productTitle}</h2>
            <ul className="mt-5 space-y-3">
              {copy.productDetails.map((detail) => (
                <li key={detail} className="flex gap-3 text-base leading-7 text-[#565a61]">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" />
                  {detail}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.025em] text-[#1b1d21]">{copy.builtTitle}</h2>
            <p className="mt-4 text-base leading-7 text-[#565a61]">{copy.builtBody}</p>
          </section>

          <div className="border-t border-[#e4e2dc] pt-8">
            <Link href="/pitch-game/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-900">
              {copy.play}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </article>
  );
};

export default ProjectDetails;
