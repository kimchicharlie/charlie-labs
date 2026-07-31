import type { MusicalNote, GameDifficulty } from "./audio/notes";
import type { PitchScore } from "./audio/scoring";

export const ROUND_COUNT = 5;
export const SINGLE_LISTENING_TIME_MS = 3000;
export const MELODY_REFERENCE_NOTE_TIME_MS = 600;
export const MELODY_REFERENCE_GAP_MS = 110;
export const MELODY_VALIDATION_WINDOW_MS = 350;
export const MELODY_REQUIRED_ON_TARGET_MS = 260;
export const MELODY_RECENT_VALIDATION_WINDOW_MS = 100;
export const MELODY_REQUIRED_RECENT_ON_TARGET_MS = 60;
export const MELODY_CORRECTION_TIME_MS = 250;
export const MELODY_NOTE_CHANGE_GRACE_MS = 450;
export const ON_TARGET_CENTS = 25;

export const melodyTimeLimitMs = (noteCount: number): number =>
  8000 + Math.max(0, noteCount) * 3000;

export type GameMode = "single" | "melody";
export type GamePhase =
  | "idle"
  | "starting"
  | "reference"
  | "preparing"
  | "listening"
  | "round-result"
  | "finished"
  | "error";
export type SingingCue = "start" | "hold" | "next";
export type Announcement =
  | "listen"
  | "prepare"
  | "sing"
  | "round-complete"
  | "round-timeout"
  | "final"
  | "error"
  | null;

export type NoteResult = {
  target: MusicalNote;
  pitch: PitchScore;
};

export type GameState = {
  mode: GameMode;
  difficulty: GameDifficulty;
  phase: GamePhase;
  round: number;
  targetSequence: MusicalNote[];
  activeNoteIndex: number;
  score: number;
  lastRoundScore: number;
  lastRoundTimeMs: number;
  lastRoundCorrections: number;
  lastRoundCompleted: boolean;
  noteResults: NoteResult[];
  countdown: number;
  singingCue: SingingCue;
  timeRemaining: number;
  errorMessage: string;
  isNewHighScore: boolean;
  announcement: Announcement;
};

export type GameAction =
  | { type: "select-mode"; mode: GameMode }
  | { type: "select-difficulty"; difficulty: GameDifficulty }
  | { type: "start-game" }
  | { type: "start-round"; round: number; sequence: MusicalNote[] }
  | { type: "reference-note"; index: number }
  | { type: "prepare" }
  | { type: "countdown"; count: number }
  | { type: "start-listening" }
  | {
      type: "singing-tick";
      index: number;
      cue: SingingCue;
      timeRemaining: number;
    }
  | { type: "note-result"; result: NoteResult }
  | {
      type: "melody-note-validated";
      index: number;
      result: NoteResult;
    }
  | { type: "melody-correction" }
  | {
      type: "complete-round";
      roundScore: number;
      elapsedMs?: number;
      corrections?: number;
      completed?: boolean;
    }
  | { type: "finish"; isNewHighScore: boolean }
  | { type: "fail"; message: string }
  | { type: "reset" };

export const createInitialGameState = (): GameState => ({
  mode: "single",
  difficulty: "easy",
  phase: "idle",
  round: 0,
  targetSequence: [],
  activeNoteIndex: 0,
  score: 0,
  lastRoundScore: 0,
  lastRoundTimeMs: 0,
  lastRoundCorrections: 0,
  lastRoundCompleted: true,
  noteResults: [],
  countdown: 3,
  singingCue: "start",
  timeRemaining: SINGLE_LISTENING_TIME_MS,
  errorMessage: "",
  isNewHighScore: false,
  announcement: null,
});

export const gameReducer = (
  state: GameState,
  action: GameAction,
): GameState => {
  switch (action.type) {
    case "select-mode":
      return state.phase === "idle" || state.phase === "error"
        ? { ...state, mode: action.mode }
        : state;
    case "select-difficulty":
      return state.phase === "idle" || state.phase === "error"
        ? { ...state, difficulty: action.difficulty }
        : state;
    case "start-game":
      return {
        ...state,
        phase: "starting",
        round: 0,
        targetSequence: [],
        activeNoteIndex: 0,
        score: 0,
        lastRoundScore: 0,
        lastRoundTimeMs: 0,
        lastRoundCorrections: 0,
        lastRoundCompleted: true,
        noteResults: [],
        countdown: 3,
        singingCue: "start",
        timeRemaining: SINGLE_LISTENING_TIME_MS,
        errorMessage: "",
        isNewHighScore: false,
        announcement: null,
      };
    case "start-round":
      return {
        ...state,
        phase: "reference",
        round: action.round,
        targetSequence: action.sequence,
        activeNoteIndex: 0,
        noteResults: [],
        lastRoundTimeMs: 0,
        lastRoundCorrections: 0,
        lastRoundCompleted: true,
        announcement: "listen",
      };
    case "reference-note":
      return { ...state, activeNoteIndex: action.index };
    case "prepare":
      return {
        ...state,
        phase: "preparing",
        activeNoteIndex: 0,
        countdown: 3,
        announcement: "prepare",
      };
    case "countdown":
      return { ...state, countdown: action.count };
    case "start-listening":
      return {
        ...state,
        phase: "listening",
        activeNoteIndex: 0,
        singingCue: "start",
        timeRemaining:
          state.mode === "single"
            ? SINGLE_LISTENING_TIME_MS
            : melodyTimeLimitMs(state.targetSequence.length),
        announcement: "sing",
      };
    case "singing-tick":
      return {
        ...state,
        activeNoteIndex: action.index,
        singingCue: action.cue,
        timeRemaining: action.timeRemaining,
      };
    case "note-result":
      return { ...state, noteResults: [...state.noteResults, action.result] };
    case "melody-note-validated":
      return {
        ...state,
        activeNoteIndex: Math.min(
          action.index + 1,
          state.targetSequence.length - 1,
        ),
        singingCue: "start",
        noteResults: [...state.noteResults, action.result],
      };
    case "melody-correction":
      return {
        ...state,
        lastRoundCorrections: state.lastRoundCorrections + 1,
      };
    case "complete-round":
      return {
        ...state,
        phase: "round-result",
        score: state.score + action.roundScore,
        lastRoundScore: action.roundScore,
        lastRoundTimeMs: action.elapsedMs ?? 0,
        lastRoundCorrections:
          action.corrections ?? state.lastRoundCorrections,
        lastRoundCompleted: action.completed ?? true,
        announcement:
          action.completed === false ? "round-timeout" : "round-complete",
      };
    case "finish":
      return {
        ...state,
        phase: "finished",
        targetSequence: [],
        activeNoteIndex: 0,
        noteResults: [],
        isNewHighScore: action.isNewHighScore,
        announcement: "final",
      };
    case "fail":
      return {
        ...state,
        phase: "error",
        targetSequence: [],
        activeNoteIndex: 0,
        noteResults: [],
        errorMessage: action.message,
        announcement: "error",
      };
    case "reset":
      return {
        ...createInitialGameState(),
        mode: state.mode,
        difficulty: state.difficulty,
      };
    default:
      return state;
  }
};

export const maxScoreForMode = (mode: GameMode): number =>
  mode === "single"
    ? ROUND_COUNT * 100
    : Array.from({ length: ROUND_COUNT }, (_, index) => index + 2).reduce(
        (total, length) => total + length * 100,
        0,
      );

export const resultColorClasses = (score: number): string => {
  if (score >= 80) {
    return "border-emerald-400/40 bg-emerald-400/15 text-emerald-200";
  }
  if (score >= 50) {
    return "border-orange-400/40 bg-orange-400/15 text-orange-200";
  }
  return "border-red-400/40 bg-red-400/15 text-red-200";
};
