import Link from "next/link";
import React from "react";
import { ArrowRight } from "lucide-react";
import { PitchGamePreview } from "@/features/pitch-game/components";
import Container from "@/shared/ui/Container";
import { HomeCopy } from "../translations";

const projectTags = ["React", "TypeScript", "Web Audio API", "AudioWorklet"];

type ProjectsProps = {
  copy: HomeCopy;
};

const Projects = ({ copy }: ProjectsProps): React.JSX.Element => (
  <section id="work" className="border-t border-[#e4e2dc] py-16 sm:py-20">
    <Container>
      <h2 className="text-2xl font-semibold tracking-[-0.025em] text-[#1b1d21] sm:text-3xl">
        {copy.projectsExperiments}
      </h2>

      <article className="mt-8 grid min-w-0 items-center gap-8 border-y border-[#e1dfd9] py-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(20rem,1.08fr)] lg:gap-12">
        <PitchGamePreview
          alt={copy.projectImageAlt}
          className="rounded-xl border border-[#d8dce1]"
          priority
        />

        <div className="min-w-0 max-w-xl">
          <p className="text-xs font-medium text-[#777b82]">
            {copy.projectMetadata}
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-[#1b1d21]">
            Pitch Matching Game
          </h3>
          <p className="mt-4 text-base leading-7 text-[#62666d]">
            {copy.projectDescription}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {projectTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#ebecef] px-2.5 py-1 font-mono text-[10px] font-medium text-[#565a61]"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/pitch-game/"
              className="inline-flex items-center rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-4"
            >
              {copy.playGame}
            </Link>
            <Link
              href="/pitch-game/case-study/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-900"
            >
              {copy.projectDetails}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </article>
    </Container>
  </section>
);

export default Projects;
