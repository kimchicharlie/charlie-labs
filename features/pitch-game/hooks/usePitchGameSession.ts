"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import {
  createHarmoniousMelody,
  createNoteSequence,
  type GameDifficulty,
  type MusicalNote,
} from "../audio/notes";
import {
  createInitialGameState,
  gameReducer,
  type GameMode,
  MELODY_REFERENCE_GAP_MS,
  MELODY_REFERENCE_NOTE_TIME_MS,
  ROUND_COUNT,
} from "../gameState";
import {
  runMelodyRound,
  runSingleNoteRound,
} from "../session/roundRunners";
import type { GameTranslations } from "../translations";
import {
  type PitchDetectorErrorCode,
  usePitchDetector,
} from "./usePitchDetector";

type RecordHighScore = (
  mode: GameMode,
  difficulty: GameDifficulty,
  score: number,
) => boolean;

const wait = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

const createRounds = (
  mode: GameMode,
  difficulty: GameDifficulty,
): MusicalNote[][] => {
  if (mode === "single") {
    return createNoteSequence(ROUND_COUNT, difficulty).map((note) => [note]);
  }

  const melody = createHarmoniousMelody(ROUND_COUNT + 1, difficulty);
  return Array.from({ length: ROUND_COUNT }, (_, index) =>
    melody.slice(0, index + 2),
  );
};

export const usePitchGameSession = (
  copy: GameTranslations,
  recordHighScore: RecordHighScore,
) => {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    createInitialGameState,
  );
  const {
    detectedFrequency,
    error: detectorError,
    start: startPitchDetector,
    playTone,
    connectAnalysis,
    disconnectAnalysis,
    beginListening,
    getListeningSamples,
    endListening,
    cleanup: cleanupPitchDetector,
    clearError: clearDetectorError,
  } = usePitchDetector();

  const runIdRef = useRef(0);
  const gameActiveRef = useRef(false);
  const continueRoundRef = useRef<(() => void) | null>(null);
  const returnHomePromiseRef = useRef<Promise<void> | null>(null);

  const detectorErrorMessage = useCallback(
    (errorCode: PitchDetectorErrorCode): string => {
      switch (errorCode) {
        case "unsupported":
          return copy.microphoneUnsupported;
        case "blocked":
          return copy.microphoneBlocked;
        case "ended":
          return copy.microphoneEnded;
        default:
          return copy.audioStartFailure;
      }
    },
    [copy],
  );

  useEffect(() => {
    if (detectorError !== "ended" || !gameActiveRef.current) return;
    runIdRef.current += 1;
    gameActiveRef.current = false;
    continueRoundRef.current?.();
    continueRoundRef.current = null;
    dispatch({ type: "fail", message: detectorErrorMessage("ended") });
  }, [detectorError, detectorErrorMessage]);

  useEffect(() => {
    return () => {
      runIdRef.current += 1;
      gameActiveRef.current = false;
      continueRoundRef.current?.();
      continueRoundRef.current = null;
    };
  }, []);

  const playReferenceSequence = useCallback(
    async (
      sequence: MusicalNote[],
      mode: GameMode,
      runId: number,
    ): Promise<void> => {
      for (let index = 0; index < sequence.length; index += 1) {
        if (runId !== runIdRef.current) return;
        dispatch({ type: "reference-note", index });
        const noteDuration =
          mode === "single" ? 1150 : MELODY_REFERENCE_NOTE_TIME_MS;
        await playTone(sequence[index].frequency, noteDuration);
        if (index < sequence.length - 1) {
          const gapDuration =
            mode === "single" ? 110 : MELODY_REFERENCE_GAP_MS;
          await wait(gapDuration);
        }
      }
      // Prevent room/speaker tail from entering microphone analysis.
      await wait(140);
    },
    [playTone],
  );

  const returnHome = useCallback(async (): Promise<void> => {
    if (returnHomePromiseRef.current) {
      return returnHomePromiseRef.current;
    }

    const transition = (async (): Promise<void> => {
      runIdRef.current += 1;
      gameActiveRef.current = false;
      continueRoundRef.current?.();
      continueRoundRef.current = null;
      try {
        await cleanupPitchDetector();
      } catch {
        // Returning to setup must remain available if browser cleanup fails.
      } finally {
        dispatch({ type: "reset" });
        returnHomePromiseRef.current = null;
      }
    })();
    returnHomePromiseRef.current = transition;
    return transition;
  }, [cleanupPitchDetector]);

  const startGame = useCallback(async (): Promise<void> => {
    if (gameActiveRef.current) return;
    gameActiveRef.current = true;

    const selectedMode = state.mode;
    const selectedDifficulty = state.difficulty;
    const runId = runIdRef.current + 1;
    const isCancelled = (): boolean => runId !== runIdRef.current;
    runIdRef.current = runId;
    clearDetectorError();
    dispatch({ type: "start-game" });

    try {
      const startError = await startPitchDetector();
      if (isCancelled()) return;
      if (startError) {
        gameActiveRef.current = false;
        dispatch({
          type: "fail",
          message: detectorErrorMessage(startError),
        });
        return;
      }

      const rounds = createRounds(selectedMode, selectedDifficulty);
      let totalScore = 0;

      for (let roundIndex = 0; roundIndex < rounds.length; roundIndex += 1) {
        if (isCancelled()) return;
        const sequence = rounds[roundIndex];
        dispatch({
          type: "start-round",
          round: roundIndex + 1,
          sequence,
        });
        await playReferenceSequence(sequence, selectedMode, runId);
        if (isCancelled()) return;

        dispatch({ type: "prepare" });
        if (selectedMode === "melody") {
          await wait(900);
          if (isCancelled()) return;
        } else {
          for (let count = 3; count >= 1; count -= 1) {
            dispatch({ type: "countdown", count });
            await wait(850);
            if (isCancelled()) return;
          }
        }

        // Worklet has zero outputs. Connection begins after reference/countdown.
        connectAnalysis();
        dispatch({ type: "start-listening" });
        const runnerDependencies = {
          dispatch,
          isCancelled,
          wait,
          beginListening,
          getListeningSamples,
          endListening,
        };
        const outcome =
          selectedMode === "single"
            ? await runSingleNoteRound(sequence[0], runnerDependencies)
            : await runMelodyRound(sequence, runnerDependencies);
        if (!outcome) return;

        disconnectAnalysis();
        totalScore += outcome.score;
        dispatch({
          type: "complete-round",
          roundScore: outcome.score,
          elapsedMs: outcome.elapsedMs,
          corrections: outcome.corrections,
          completed: outcome.completed,
        });
        await new Promise<void>((resolve) => {
          continueRoundRef.current = resolve;
        });
        continueRoundRef.current = null;
        if (isCancelled()) return;
      }

      const isNewHighScore = recordHighScore(
        selectedMode,
        selectedDifficulty,
        totalScore,
      );
      await cleanupPitchDetector();
      if (isCancelled()) return;
      gameActiveRef.current = false;
      dispatch({ type: "finish", isNewHighScore });
    } catch {
      await cleanupPitchDetector();
      if (isCancelled()) return;
      gameActiveRef.current = false;
      dispatch({ type: "fail", message: copy.audioStartFailure });
    }
  }, [
    beginListening,
    cleanupPitchDetector,
    clearDetectorError,
    connectAnalysis,
    copy.audioStartFailure,
    detectorErrorMessage,
    disconnectAnalysis,
    endListening,
    getListeningSamples,
    playReferenceSequence,
    recordHighScore,
    startPitchDetector,
    state.difficulty,
    state.mode,
  ]);

  const continueRound = useCallback((): void => {
    continueRoundRef.current?.();
  }, []);

  return {
    state,
    dispatch,
    detectedFrequency,
    startGame,
    returnHome,
    continueRound,
  };
};
