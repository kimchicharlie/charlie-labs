"use client";

import React from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import type { GameState } from "../gameState";
import type { GameTranslations } from "../translations";
import ExerciseHeader from "./ExerciseHeader";
import ListeningPanel from "./ListeningPanel";
import MelodySequence from "./MelodySequence";
import NoteOverview from "./NoteOverview";
import RoundResult from "./RoundResult";

type ActiveExerciseProps = {
  copy: GameTranslations;
  state: GameState;
  detectedFrequency: number | null;
  centsDifference: number | null;
  pitchStatus: string;
  isOnTarget: boolean;
  progress: number;
  formattedTimeRemaining: string;
  highScore: number;
  reduceMotion: boolean;
  onHome: () => void;
  onContinue: () => void;
};

const ActiveExercise = ({
  copy,
  state,
  detectedFrequency,
  centsDifference,
  pitchStatus,
  isOnTarget,
  progress,
  formattedTimeRemaining,
  highScore,
  reduceMotion,
  onHome,
  onContinue,
}: ActiveExerciseProps): React.JSX.Element | null => {
  const activeTarget = state.targetSequence[state.activeNoteIndex] ?? null;
  if (!activeTarget) return null;

  return (
    <div>
      <ExerciseHeader
        copy={copy}
        state={state}
        highScore={highScore}
        onHome={onHome}
      />

      {state.mode === "melody" && (
        <MelodySequence
          copy={copy}
          state={state}
          reduceMotion={reduceMotion}
        />
      )}

      <NoteOverview
        activeTarget={activeTarget}
        copy={copy}
        state={state}
        detectedFrequency={detectedFrequency}
      />

      {state.phase === "reference" && (
        <div className="mt-4 flex min-h-32 flex-col items-center justify-center rounded-2xl border border-white/10 bg-primary-400/10 px-5 py-6 text-primary-100">
          <Volume2 className="mb-2 h-8 w-8 animate-pulse text-primary-200 motion-reduce:animate-none" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary-300">
            {copy.listen}
          </span>
          <span className="mt-2 text-xl font-bold">
            {state.mode === "single"
              ? copy.hearTarget
              : copy.rememberNotes(state.targetSequence.length)}
          </span>
        </div>
      )}

      {state.phase === "preparing" && (
        <div className="mt-4 flex min-h-44 flex-col items-center justify-center rounded-2xl border border-white/10 bg-amber-400/10 px-5 py-6 text-center">
          {state.mode === "melody" ? (
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl font-black text-amber-100"
            >
              {copy.yourTurn}
            </motion.span>
          ) : (
            <>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">
                {copy.yourTurnIn}
              </span>
              <motion.span
                key={state.countdown}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.65 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-2 text-7xl font-black text-amber-100"
              >
                {state.countdown}
              </motion.span>
              <span className="mt-2 text-sm text-amber-100/70">
                {copy.getReady}
              </span>
            </>
          )}
        </div>
      )}

      {state.phase === "listening" && (
        <ListeningPanel
          copy={copy}
          state={state}
          centsDifference={centsDifference}
          pitchStatus={pitchStatus}
          isOnTarget={isOnTarget}
          progress={progress}
          formattedTimeRemaining={formattedTimeRemaining}
        />
      )}

      {state.phase === "round-result" && (
        <RoundResult
          copy={copy}
          mode={state.mode}
          round={state.round}
          roundScore={state.lastRoundScore}
          elapsedMs={state.lastRoundTimeMs}
          corrections={state.lastRoundCorrections}
          completed={state.lastRoundCompleted}
          noteResults={state.noteResults}
          onContinue={onContinue}
        />
      )}
    </div>
  );
};

export default ActiveExercise;
