"use client";

import React from "react";
import { useReducedMotion } from "framer-motion";
import { LoaderCircle, Music2 } from "lucide-react";
import { useLanguage } from "@/shared/i18n";
import { octaveIndependentCentsDifference } from "./audio/scoring";
import { ActiveExercise, FinalResult, SetupScreen } from "./components";
import {
  maxScoreForMode,
  melodyTimeLimitMs,
  ON_TARGET_CENTS,
  SINGLE_LISTENING_TIME_MS,
} from "./gameState";
import { getScoreKey, useHighScores } from "./hooks/useHighScores";
import { usePitchGameSession } from "./hooks/usePitchGameSession";
import { gameTranslations } from "./translations";

const PitchGame = (): React.JSX.Element => {
  const { language } = useLanguage();
  const copy = gameTranslations[language];
  const reduceMotion = Boolean(useReducedMotion());
  const { highScores, recordHighScore } = useHighScores();
  const {
    state,
    dispatch,
    detectedFrequency,
    startGame,
    returnHome,
    continueRound,
  } = usePitchGameSession(copy, recordHighScore);

  const activeTarget = state.targetSequence[state.activeNoteIndex] ?? null;
  const centsDifference =
    state.phase === "listening" && detectedFrequency && activeTarget
      ? octaveIndependentCentsDifference(
          detectedFrequency,
          activeTarget.frequency,
        )
      : null;
  const isOnTarget =
    centsDifference !== null &&
    Math.abs(centsDifference) <= ON_TARGET_CENTS;
  let pitchStatus = copy.singSteady;
  if (centsDifference !== null) {
    if (isOnTarget) {
      pitchStatus = copy.onTarget;
    } else if (centsDifference < 0) {
      pitchStatus = copy.tooLow;
    } else {
      pitchStatus = copy.tooHigh;
    }
  }

  const noteDuration =
    state.mode === "single"
      ? SINGLE_LISTENING_TIME_MS
      : melodyTimeLimitMs(state.targetSequence.length);
  const progress = Math.max(
    0,
    Math.min(100, (state.timeRemaining / noteDuration) * 100),
  );
  const formattedTimeRemaining = (state.timeRemaining / 1000).toLocaleString(
    language,
    { minimumFractionDigits: 1, maximumFractionDigits: 1 },
  );
  const currentHighScore =
    highScores[getScoreKey(state.mode, state.difficulty)];

  const announcementText = (() => {
    switch (state.announcement) {
      case "listen":
        return copy.listen;
      case "prepare":
        return copy.getReady;
      case "sing":
        return copy.singNow;
      case "round-complete":
        return copy.roundCompleted;
      case "round-timeout":
        return copy.timeUp;
      case "final":
        return copy.finalAnnouncement(
          state.score,
          maxScoreForMode(state.mode),
        );
      default:
        return "";
    }
  })();

  const isRoundActive =
    state.phase === "reference" ||
    state.phase === "preparing" ||
    state.phase === "listening" ||
    state.phase === "round-result";

  return (
    <section className="mx-auto w-full max-w-3xl">
      <p className="sr-only" aria-live="assertive" aria-atomic="true">
        {announcementText}
      </p>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-gray-900 text-white shadow-2xl shadow-primary-900/20">
        <div className="relative px-6 py-7 sm:px-10 sm:py-9">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl" />
          <div className="absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl" />
          <div className="relative">
            <div className="mb-7 flex items-center justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">
                  {copy.learnToSing}
                </p>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {copy.title}
                </h1>
              </div>
              <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-white/10 sm:flex">
                <Music2 className="h-7 w-7 text-primary-300" />
              </div>
            </div>

            {(state.phase === "idle" || state.phase === "error") && (
              <SetupScreen
                copy={copy}
                mode={state.mode}
                difficulty={state.difficulty}
                oneNoteBest={
                  highScores[getScoreKey("single", state.difficulty)]
                }
                melodyBest={
                  highScores[getScoreKey("melody", state.difficulty)]
                }
                errorMessage={state.errorMessage}
                reduceMotion={reduceMotion}
                onModeChange={(mode) =>
                  dispatch({ type: "select-mode", mode })
                }
                onDifficultyChange={(difficulty) =>
                  dispatch({ type: "select-difficulty", difficulty })
                }
                onPlay={() => void startGame()}
              />
            )}

            {state.phase === "starting" && (
              <div className="flex min-h-56 flex-col items-center justify-center text-center">
                <LoaderCircle className="mb-4 h-9 w-9 animate-spin text-primary-300 motion-reduce:animate-none" />
                <p className="font-semibold">{copy.preparingMicrophone}</p>
                <p className="mt-2 text-sm text-gray-400">
                  {copy.privacyNotice}
                </p>
              </div>
            )}

            {isRoundActive && (
              <ActiveExercise
                copy={copy}
                state={state}
                detectedFrequency={detectedFrequency}
                centsDifference={centsDifference}
                pitchStatus={pitchStatus}
                isOnTarget={isOnTarget}
                progress={progress}
                formattedTimeRemaining={formattedTimeRemaining}
                highScore={currentHighScore}
                reduceMotion={reduceMotion}
                onHome={returnHome}
                onContinue={continueRound}
              />
            )}

            {state.phase === "finished" && (
              <FinalResult
                copy={copy}
                mode={state.mode}
                difficulty={state.difficulty}
                score={state.score}
                highScore={currentHighScore}
                isNewHighScore={state.isNewHighScore}
                reduceMotion={reduceMotion}
                onPlayAgain={() => void startGame()}
                onChangeSettings={returnHome}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-center text-xs text-gray-500">
        <span>{copy.yinDetection}</span>
        <span>{copy.octaveIndependent}</span>
        <span>{copy.noRecording}</span>
      </div>
    </section>
  );
};

export default PitchGame;
