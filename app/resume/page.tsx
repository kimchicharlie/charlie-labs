import type { Metadata } from "next";
import React from "react";
import Resume from "@/features/resume";

export const metadata: Metadata = {
  title: "Resume — Charlie Henin",
  description: "Charlie Henin’s full-stack developer resume and downloadable PDF versions.",
};

const ResumePage = (): React.JSX.Element => <Resume />;

export default ResumePage;
