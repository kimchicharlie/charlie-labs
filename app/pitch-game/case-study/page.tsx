import type { Metadata } from "next";
import React from "react";
import ProjectDetails from "@/features/pitch-game/ProjectDetails";

export const metadata: Metadata = {
  title: "Pitch Matching Game — Charlie Henin",
  description: "Product details for Charlie Henin’s browser-based pitch matching game.",
};

const PitchGameProjectPage = (): React.JSX.Element => <ProjectDetails />;

export default PitchGameProjectPage;
