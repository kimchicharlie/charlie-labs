import React from "react";
import { House, Trophy } from "lucide-react";
import { type GameState, ROUND_COUNT } from "../gameState";
import type { GameTranslations } from "../translations";

type ExerciseHeaderProps = {
  copy: GameTranslations;
  state: GameState;
  highScore: number;
  onHome: () => void;
};

const ExerciseHeader = ({
  copy,
  state,
  highScore,
  onHome,
}: ExerciseHeaderProps): React.JSX.Element => (
  <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onHome}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-xs font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
      >
        <House className="h-3.5 w-3.5" />
        {copy.home}
      </button>
      <span className="text-sm text-gray-400">
        {state.mode === "single" ? copy.round : copy.level}{" "}
        <strong className="text-white">{state.round}</strong> {copy.of}{" "}
        {ROUND_COUNT}
      </span>
    </div>
    <span className="flex items-center gap-2">
      <span className="hidden items-center gap-1 text-xs font-semibold text-gray-400 sm:inline-flex">
        <Trophy className="h-3.5 w-3.5" />
        {copy.personalBest}: {highScore}
      </span>
      <span className="rounded-full bg-white/[0.07] px-2.5 py-1 text-xs font-semibold text-gray-300">
        {state.difficulty === "easy" ? copy.easy : copy.hard}
      </span>
      <span className="font-semibold text-primary-200">
        {state.score} {copy.pointsAbbreviation}
      </span>
    </span>
  </div>
);

export default ExerciseHeader;
