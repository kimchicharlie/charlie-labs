import type { Metadata } from "next";
import React from "react";
import PitchGame from "@/features/pitch-game";

export const metadata: Metadata = {
  title: "Pitch Match — Charlie Henin",
  description:
    "A five-round browser pitch-matching game powered by the Web Audio API.",
};

const PitchGamePage = (): React.JSX.Element => {
  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-10 sm:px-6 sm:py-16">
      <PitchGame />
    </div>
  );
};

export default PitchGamePage;
