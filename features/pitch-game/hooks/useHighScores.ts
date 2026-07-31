"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GameDifficulty } from "../audio/notes";
import { type GameMode, maxScoreForMode } from "../gameState";

export type ScoreKey = `${GameMode}-${GameDifficulty}`;
export type HighScores = Record<ScoreKey, number>;

const HIGH_SCORES_STORAGE_KEY = "pitch-game-high-scores-v2";
const LEGACY_HIGH_SCORES_STORAGE_KEY = "pitch-game-high-scores-v1";
const EMPTY_HIGH_SCORES: HighScores = {
  "single-easy": 0,
  "single-hard": 0,
  "melody-easy": 0,
  "melody-hard": 0,
};

export const getScoreKey = (
  mode: GameMode,
  difficulty: GameDifficulty,
): ScoreKey => `${mode}-${difficulty}`;

const isStoredScore = (value: unknown, maximum: number): value is number =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  value >= 0 &&
  value <= maximum;

const parseHighScores = (
  serializedScores: string,
  isLegacyMigration: boolean,
): HighScores => {
  const parsed: unknown = JSON.parse(serializedScores);
  const storedValues =
    typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, unknown>)
      : {};

  return Object.fromEntries(
    Object.entries(EMPTY_HIGH_SCORES).map(([key, fallbackScore]) => {
      const scoreKey = key as ScoreKey;
      const mode: GameMode = scoreKey.startsWith("single")
        ? "single"
        : "melody";
      const storedScore =
        isLegacyMigration && mode === "melody"
          ? undefined
          : storedValues[scoreKey];
      const maximum = maxScoreForMode(mode);
      return [
        scoreKey,
        isStoredScore(storedScore, maximum)
          ? Math.round(storedScore)
          : fallbackScore,
      ];
    }),
  ) as HighScores;
};

export const useHighScores = () => {
  const [highScores, setHighScores] = useState<HighScores>({
    ...EMPTY_HIGH_SCORES,
  });
  const highScoresRef = useRef<HighScores>({ ...EMPTY_HIGH_SCORES });

  useEffect(() => {
    try {
      const storedScores = window.localStorage.getItem(HIGH_SCORES_STORAGE_KEY);
      const legacyScores = storedScores
        ? null
        : window.localStorage.getItem(LEGACY_HIGH_SCORES_STORAGE_KEY);
      const serializedScores = storedScores ?? legacyScores;
      if (!serializedScores) return;

      const isLegacyMigration = !storedScores && Boolean(legacyScores);
      const validatedScores = parseHighScores(
        serializedScores,
        isLegacyMigration,
      );
      highScoresRef.current = validatedScores;
      setHighScores(validatedScores);
      if (isLegacyMigration) {
        window.localStorage.setItem(
          HIGH_SCORES_STORAGE_KEY,
          JSON.stringify(validatedScores),
        );
      }
    } catch {
      // Invalid or unavailable localStorage must not block the game.
    }
  }, []);

  const recordHighScore = useCallback(
    (
      mode: GameMode,
      difficulty: GameDifficulty,
      completedScore: number,
    ): boolean => {
      const key = getScoreKey(mode, difficulty);
      if (completedScore <= highScoresRef.current[key]) return false;

      const updatedScores = {
        ...highScoresRef.current,
        [key]: completedScore,
      };
      highScoresRef.current = updatedScores;
      setHighScores(updatedScores);
      try {
        window.localStorage.setItem(
          HIGH_SCORES_STORAGE_KEY,
          JSON.stringify(updatedScores),
        );
      } catch {
        // In-memory score remains useful when persistent storage is blocked.
      }
      return true;
    },
    [],
  );

  return { highScores, recordHighScore };
};
