import type { Dispatch } from "react";
import type { MusicalNote } from "../audio/notes";
import {
  latestPitchZone,
  pitchWindowMetrics,
  type PitchSample,
  type PitchZone,
  scoreMelodyRound,
  scorePitchSamples,
} from "../audio/scoring";
import {
  type GameAction,
  MELODY_CORRECTION_TIME_MS,
  MELODY_NOTE_CHANGE_GRACE_MS,
  MELODY_RECENT_VALIDATION_WINDOW_MS,
  MELODY_REQUIRED_ON_TARGET_MS,
  MELODY_REQUIRED_RECENT_ON_TARGET_MS,
  MELODY_VALIDATION_WINDOW_MS,
  melodyTimeLimitMs,
  type NoteResult,
  ON_TARGET_CENTS,
  SINGLE_LISTENING_TIME_MS,
  type SingingCue,
} from "../gameState";

type RoundRunnerDependencies = {
  dispatch: Dispatch<GameAction>;
  isCancelled: () => boolean;
  wait: (milliseconds: number) => Promise<void>;
  beginListening: () => void;
  getListeningSamples: () => PitchSample[];
  endListening: () => PitchSample[];
};

export type RoundOutcome = {
  score: number;
  elapsedMs: number;
  corrections: number;
  completed: boolean;
};

const getSingingCue = (
  elapsedMs: number,
  remainingMs: number,
): SingingCue => {
  if (elapsedMs < 250) return "start";
  if (remainingMs <= 350) return "next";
  return "hold";
};

export const runSingleNoteRound = async (
  target: MusicalNote,
  dependencies: RoundRunnerDependencies,
): Promise<RoundOutcome | null> => {
  const { beginListening, dispatch, endListening, isCancelled, wait } =
    dependencies;
  navigator.vibrate?.(35);
  beginListening();
  const startedAt = performance.now();
  let lastTimerUpdate = -200;

  while (performance.now() - startedAt < SINGLE_LISTENING_TIME_MS) {
    if (isCancelled()) return null;
    const elapsed = performance.now() - startedAt;
    const remaining = Math.max(0, SINGLE_LISTENING_TIME_MS - elapsed);
    if (elapsed - lastTimerUpdate >= 200) {
      lastTimerUpdate = elapsed;
      dispatch({
        type: "singing-tick",
        index: 0,
        cue: getSingingCue(elapsed, remaining),
        timeRemaining: remaining,
      });
    }
    await wait(50);
  }

  const pitch = scorePitchSamples(
    endListening(),
    target.frequency,
    SINGLE_LISTENING_TIME_MS,
    { onTargetCents: ON_TARGET_CENTS },
  );
  const result = { target, pitch };
  dispatch({ type: "note-result", result });
  return {
    score: pitch.score,
    elapsedMs: 0,
    corrections: 0,
    completed: true,
  };
};

const createValidatedResult = (
  target: MusicalNote,
  capturedSamples: PitchSample[],
  noteElapsedMs: number,
): NoteResult => {
  const validationSamples = pitchWindowMetrics(
    capturedSamples,
    target.frequency,
    noteElapsedMs,
    MELODY_VALIDATION_WINDOW_MS,
    ON_TARGET_CENTS,
  ).samples;
  const validationStartedAt = validationSamples[0]?.timeMs ?? 0;
  const rebasedSamples = validationSamples.map((sample) => ({
    ...sample,
    timeMs: sample.timeMs - validationStartedAt,
  }));
  const validationDuration = Math.max(
    MELODY_VALIDATION_WINDOW_MS,
    rebasedSamples[rebasedSamples.length - 1]?.timeMs ?? 0,
  );
  return {
    target,
    pitch: scorePitchSamples(
      rebasedSamples,
      target.frequency,
      validationDuration,
      { onTargetCents: ON_TARGET_CENTS },
    ),
  };
};

export const runMelodyRound = async (
  sequence: MusicalNote[],
  dependencies: RoundRunnerDependencies,
): Promise<RoundOutcome | null> => {
  const {
    beginListening,
    dispatch,
    endListening,
    getListeningSamples,
    isCancelled,
    wait,
  } = dependencies;
  const timeLimitMs = melodyTimeLimitMs(sequence.length);
  const roundStartedAt = performance.now();
  const results: NoteResult[] = [];
  let correctionCount = 0;
  let firstNoteCorrectionCount = 0;
  let lastTimerUpdate = -200;
  let timedOut = false;

  for (let noteIndex = 0; noteIndex < sequence.length; noteIndex += 1) {
    if (isCancelled()) return null;
    const target = sequence[noteIndex];
    const noteStartedAt = performance.now();
    let wrongZone: PitchZone | null = null;
    let wrongZoneStartedAt = 0;
    let wrongZoneCounted = false;
    let noteValidated = false;
    beginListening();

    while (!noteValidated) {
      if (isCancelled()) return null;
      const now = performance.now();
      const elapsed = now - roundStartedAt;
      const noteElapsed = now - noteStartedAt;
      const remaining = Math.max(0, timeLimitMs - elapsed);
      if (remaining === 0) {
        endListening();
        timedOut = true;
        break;
      }

      const samples = getListeningSamples();
      const zone = latestPitchZone(
        samples,
        target.frequency,
        noteElapsed,
        ON_TARGET_CENTS,
      );
      const validationWindow = pitchWindowMetrics(
        samples,
        target.frequency,
        noteElapsed,
        MELODY_VALIDATION_WINDOW_MS,
        ON_TARGET_CENTS,
      );
      const recentValidationWindow = pitchWindowMetrics(
        samples,
        target.frequency,
        noteElapsed,
        MELODY_RECENT_VALIDATION_WINDOW_MS,
        ON_TARGET_CENTS,
      );

      if (elapsed - lastTimerUpdate >= 100) {
        lastTimerUpdate = elapsed;
        dispatch({
          type: "singing-tick",
          index: noteIndex,
          cue: zone === "on-target" ? "hold" : "start",
          timeRemaining: remaining,
        });
      }

      const isWrongZone = zone === "low" || zone === "high";
      if (isWrongZone && noteElapsed >= MELODY_NOTE_CHANGE_GRACE_MS) {
        if (zone !== wrongZone) {
          wrongZone = zone;
          wrongZoneStartedAt = noteElapsed;
          wrongZoneCounted = false;
        } else if (
          !wrongZoneCounted &&
          noteElapsed - wrongZoneStartedAt >= MELODY_CORRECTION_TIME_MS
        ) {
          wrongZoneCounted = true;
          correctionCount += 1;
          if (noteIndex === 0) firstNoteCorrectionCount += 1;
          dispatch({ type: "melody-correction" });
        }
      } else if (!isWrongZone) {
        wrongZone = null;
        wrongZoneCounted = false;
      }

      const canValidate =
        zone !== null &&
        validationWindow.onTargetDurationMs >= MELODY_REQUIRED_ON_TARGET_MS &&
        recentValidationWindow.onTargetDurationMs >=
          MELODY_REQUIRED_RECENT_ON_TARGET_MS;
      if (canValidate) {
        const result = createValidatedResult(
          target,
          endListening(),
          noteElapsed,
        );
        results.push(result);
        dispatch({
          type: "melody-note-validated",
          index: noteIndex,
          result,
        });
        navigator.vibrate?.(25);
        noteValidated = true;
      } else {
        await wait(40);
      }
    }

    if (timedOut) break;
  }

  const elapsedMs = Math.min(
    timeLimitMs,
    performance.now() - roundStartedAt,
  );
  const validatedNoteCount = results.length;
  const completed = validatedNoteCount === sequence.length;

  while (results.length < sequence.length) {
    const target = sequence[results.length];
    const result = {
      target,
      pitch: scorePitchSamples([], target.frequency, 1),
    };
    results.push(result);
    dispatch({ type: "note-result", result });
  }

  const score = scoreMelodyRound({
    noteScores: results
      .slice(0, validatedNoteCount)
      .map((result) => result.pitch),
    expectedNoteCount: sequence.length,
    elapsedMs,
    timeLimitMs,
    correctionCount,
    firstNoteCorrectionCount,
  }).points;

  return { score, elapsedMs, corrections: correctionCount, completed };
};
