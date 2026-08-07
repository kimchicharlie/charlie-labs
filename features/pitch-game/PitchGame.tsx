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
    <section className="mx-auto w-full max-w-5xl">
      <p className="sr-only" aria-live="assertive" aria-atomic="true">
        {announcementText}
      </p>

      <div className="overflow-hidden rounded-3xl bg-[#14283f] text-white shadow-[0_22px_60px_rgba(20,40,63,0.16)]">
        <div className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
          <header className="mb-7 flex items-start justify-between gap-4 border-b border-white/10 pb-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-300">{copy.learnToSing}</p>
              <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                {copy.title}
              </h1>
            </div>
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.07] sm:flex">
              <Music2 className="h-6 w-6 text-primary-300" />
            </div>
          </header>

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
              <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-center">
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
                onPlayAgain={() => void startGame()}
                onChangeSettings={returnHome}
              />
            )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-center text-xs text-[#777b82]">
        <span>{copy.yinDetection}</span>
        <span>{copy.octaveIndependent}</span>
        <span>{copy.noRecording}</span>
      </div>
    </section>
  );
};

export default PitchGame;
