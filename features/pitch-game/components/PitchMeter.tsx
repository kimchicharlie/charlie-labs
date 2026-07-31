"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

type PitchMeterProps = {
  centsDifference: number | null;
  lowLabel: string;
  targetLabel: string;
  highLabel: string;
};

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(maximum, Math.max(minimum, value));

const PitchMeter = ({
  centsDifference,
  lowLabel,
  targetLabel,
  highLabel,
}: PitchMeterProps): React.JSX.Element => {
  const reduceMotion = useReducedMotion();
  const clampedCents = clamp(centsDifference ?? 0, -100, 100);
  const position = ((clampedCents + 100) / 200) * 100;

  return (
    <div className="mt-5" aria-hidden="true">
      <div className="relative h-3 rounded-full bg-gradient-to-r from-red-400 via-emerald-400 to-red-400">
        <div className="absolute left-[37.5%] top-0 h-full w-1/4 bg-emerald-300/80" />
        <div className="absolute left-1/2 top-[-4px] h-5 w-px bg-white/70" />
        <motion.div
          className="absolute top-1/2 h-6 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gray-900 shadow-lg"
          initial={false}
          animate={{
            left: `${position}%`,
            opacity: centsDifference !== null ? 1 : 0.35,
          }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 300, damping: 28, mass: 0.35 }
          }
        />
      </div>
      <div className="mt-2 flex justify-between text-[11px] font-medium text-gray-500">
        <span>{lowLabel}</span>
        <span>{targetLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
};

export default PitchMeter;
