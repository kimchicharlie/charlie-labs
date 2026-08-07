import type { Metadata } from "next";
import React from "react";
import PitchGame from "@/features/pitch-game";

export const metadata: Metadata = {
  title: "Singing Training — Charlie Henin",
  description:
    "Browser-based ear and voice training powered by the Web Audio API.",
};

const PitchGamePage = (): React.JSX.Element => {
  return (
    <div className="site-canvas flex-1 px-3 py-9 sm:px-6 sm:py-14 lg:py-16">
      <PitchGame />
    </div>
  );
};

export default PitchGamePage;
