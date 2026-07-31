"use client";

import React from "react";
import { motion } from "framer-motion";
import { Layers3, Mic, Trophy } from "lucide-react";
import type { GameDifficulty } from "../audio/notes";
import { maxScoreForMode } from "../gameState";
import type { GameMode } from "../gameState";
import type { GameTranslations } from "../translations";

type SetupScreenProps = {
  copy: GameTranslations;
  mode: GameMode;
  difficulty: GameDifficulty;
  oneNoteBest: number;
  melodyBest: number;
  errorMessage: string;
  reduceMotion: boolean;
  onModeChange: (mode: GameMode) => void;
  onDifficultyChange: (difficulty: GameDifficulty) => void;
  onPlay: () => void;
};

const getDifficultyDescription = (
  option: GameDifficulty,
  mode: GameMode,
  copy: GameTranslations,
): string => {
  if (option === "easy") return copy.easyDescription;
  if (mode === "single") return copy.hardSingleDescription;
  return copy.hardMelodyDescription;
};

const SetupScreen = ({
  copy,
  mode,
  difficulty,
  oneNoteBest,
  melodyBest,
  errorMessage,
  reduceMotion,
  onModeChange,
  onDifficultyChange,
  onPlay,
}: SetupScreenProps): React.JSX.Element => (
  <motion.div
    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 sm:p-8"
  >
    <p className="text-base leading-7 text-gray-300">{copy.introduction}</p>

    <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
      {copy.exercise}
    </p>
    <div className="mt-3 grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => onModeChange("single")}
        className={`rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-primary-300 ${
          mode === "single"
            ? "border-primary-400 bg-primary-400/15"
            : "border-white/10 bg-black/10 hover:border-white/25"
        }`}
        aria-pressed={mode === "single"}
      >
        <Mic className="mb-3 h-5 w-5 text-primary-300" />
        <span className="block font-semibold">{copy.oneNote}</span>
        <span className="mt-1 block text-sm text-gray-400">
          {copy.oneNoteDescription}
        </span>
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-200">
          <Trophy className="h-3.5 w-3.5" />
          {copy.best(oneNoteBest, maxScoreForMode("single"))}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onModeChange("melody")}
        className={`rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-primary-300 ${
          mode === "melody"
            ? "border-primary-400 bg-primary-400/15"
            : "border-white/10 bg-black/10 hover:border-white/25"
        }`}
        aria-pressed={mode === "melody"}
      >
        <Layers3 className="mb-3 h-5 w-5 text-primary-300" />
        <span className="block font-semibold">{copy.melodyMemory}</span>
        <span className="mt-1 block text-sm text-gray-400">
          {copy.melodyDescription}
        </span>
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-200">
          <Trophy className="h-3.5 w-3.5" />
          {copy.best(melodyBest, maxScoreForMode("melody"))}
        </span>
      </button>
    </div>

    <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
      {copy.difficulty}
    </p>
    <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-black/20 p-1.5">
      {(["easy", "hard"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onDifficultyChange(option)}
          className={`rounded-xl px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-primary-300 ${
            difficulty === option
              ? "bg-white/10 text-white shadow-sm"
              : "text-gray-400 hover:bg-white/[0.05] hover:text-white"
          }`}
          aria-pressed={difficulty === option}
        >
          <span className="block font-semibold">
            {option === "easy" ? copy.easy : copy.hard}
          </span>
          <span className="mt-0.5 block text-xs text-gray-400">
            {getDifficultyDescription(option, mode, copy)}
          </span>
        </button>
      ))}
    </div>

    {errorMessage && (
      <p
        className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200"
        role="alert"
      >
        {errorMessage}
      </p>
    )}

    <button
      type="button"
      onClick={onPlay}
      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-3 font-semibold text-white transition hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 focus:ring-offset-gray-900"
    >
      <Mic className="h-5 w-5" />
      {copy.play}
    </button>
    <p className="mt-3 text-xs text-gray-500">{copy.microphoneNotice}</p>
  </motion.div>
);

export default SetupScreen;
