import React from "react";
import Container from "@/shared/ui/Container";
import { HomeCopy } from "../translations";

type AboutProps = {
  copy: HomeCopy;
};

const About = ({ copy }: AboutProps): React.JSX.Element => (
  <section
    id="about"
    className="border-t border-[#e4e2dc] bg-white py-20 sm:py-24"
  >
    <Container>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.31fr)_minmax(0,0.69fr)] lg:gap-12 xl:gap-16">
        <div>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#1b1d21] sm:text-4xl">
            {copy.about}
          </h2>
        </div>
        <div className="max-w-2xl space-y-5 text-lg leading-8 text-[#51555c]">
          {copy.aboutParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="text-base text-[#777b82]">{copy.personalNote}</p>
        </div>
      </div>

      <div className="mt-16 border-t border-[#e4e2dc] pt-10">
        <h3 className="text-lg font-semibold text-[#1b1d21]">
          {copy.technologies}
        </h3>
        <dl className="mt-6 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-sm font-medium text-[#777b82]">{copy.core}</dt>
            <dd className="mt-2 leading-7 text-[#35383e]">
              TypeScript · React · Next.js · Node.js
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[#777b82]">
              {copy.platforms}
            </dt>
            <dd className="mt-2 leading-7 text-[#35383e]">
              Web Audio API · AudioWorklet · Service Workers · WebAssembly
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[#777b82]">
              {copy.infrastructure}
            </dt>
            <dd className="mt-2 leading-7 text-[#35383e]">
              AWS · GCP · Docker · Kubernetes
            </dd>
          </div>
        </dl>
      </div>
    </Container>
  </section>
);

export default About;
