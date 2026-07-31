"use client";

import React from "react";
import { motion } from "framer-motion";
import { Gauge, House, RefreshCw, Trophy } from "lucide-react";
import type { GameDifficulty } from "../audio/notes";
import { maxScoreForMode } from "../gameState";
import type { GameMode } from "../gameState";
import type { GameTranslations } from "../translations";

type FinalResultProps = {
  copy: GameTranslations;
  mode: GameMode;
  difficulty: GameDifficulty;
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  reduceMotion: boolean;
  onPlayAgain: () => void;
  onChangeSettings: () => void;
};

const FinalResult = ({
  copy,
  mode,
  difficulty,
  score,
  highScore,
  isNewHighScore,
  reduceMotion,
  onPlayAgain,
  onChangeSettings,
}: FinalResultProps): React.JSX.Element => (
  <motion.div
    initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-10 text-center"
  >
    {isNewHighScore ? (
      <Trophy className="mx-auto mb-4 h-10 w-10 text-amber-300" />
    ) : (
      <Gauge className="mx-auto mb-4 h-10 w-10 text-primary-300" />
    )}
    <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
      {isNewHighScore ? copy.newPersonalBest : copy.finalScore}
    </p>
    <p className="mt-2 text-6xl font-bold">
      {score}
      <span className="text-2xl text-gray-500">
        {" "}/ {maxScoreForMode(mode)}
      </span>
    </p>
    <p className="mt-3 text-sm text-gray-400">
      {difficulty === "easy" ? copy.easy : copy.hard} ·{" "}
      {mode === "single" ? copy.oneNote : copy.melodyMemory}
    </p>
    {!isNewHighScore && (
      <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-200">
        <Trophy className="h-4 w-4" />
        {copy.personalBest}: {highScore}
      </p>
    )}
    <div className="mt-7 flex flex-wrap justify-center gap-3">
      <button
        type="button"
        onClick={onPlayAgain}
        className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-3 font-semibold text-white transition hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        <RefreshCw className="h-5 w-5" />
        {copy.playAgain}
      </button>
      <button
        type="button"
        onClick={onChangeSettings}
        className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-semibold text-gray-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-300"
      >
        <House className="h-5 w-5" />
        {copy.home}
      </button>
    </div>
  </motion.div>
);

export default FinalResult;
