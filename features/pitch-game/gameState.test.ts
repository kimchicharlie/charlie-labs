import assert from "node:assert/strict";
import test from "node:test";
import type { MusicalNote } from "./audio/notes";
import type { PitchScore } from "./audio/scoring";
import {
  createInitialGameState,
  gameReducer,
  melodyTimeLimitMs,
} from "./gameState";

const notes: MusicalNote[] = [
  { name: "G3", frequency: 195.9977 },
  { name: "A3", frequency: 220 },
];
const pitch: PitchScore = {
  score: 95,
  accuracy: 96,
  stability: 94,
  onTargetPercentage: 90,
  onTargetDurationMs: 315,
  voicedDurationMs: 350,
  averageCentsDifference: -2,
  averageAbsoluteCentsDifference: 4,
  timeToTargetMs: 20,
  representativeFrequency: 195.9977,
  sampleCount: 16,
  coachingKey: "quick-and-steady",
};

const startMelodyRound = () => {
  let state = gameReducer(createInitialGameState(), {
    type: "select-mode",
    mode: "melody",
  });
  state = gameReducer(state, {
    type: "start-round",
    round: 1,
    sequence: notes,
  });
  return gameReducer(state, { type: "start-listening" });
};

test("melody starts with one timer for the complete sequence", () => {
  const state = startMelodyRound();

  assert.equal(state.phase, "listening");
  assert.equal(state.timeRemaining, melodyTimeLimitMs(notes.length));
});

test("validated melody notes advance automatically", () => {
  const state = gameReducer(startMelodyRound(), {
    type: "melody-note-validated",
    index: 0,
    result: { target: notes[0], pitch },
  });

  assert.equal(state.activeNoteIndex, 1);
  assert.equal(state.noteResults.length, 1);
});

test("timed-out melody rounds retain incomplete result state", () => {
  const state = gameReducer(startMelodyRound(), {
    type: "complete-round",
    roundScore: 40,
    elapsedMs: melodyTimeLimitMs(notes.length),
    corrections: 2,
    completed: false,
  });

  assert.equal(state.phase, "round-result");
  assert.equal(state.lastRoundCompleted, false);
  assert.equal(state.lastRoundCorrections, 2);
  assert.equal(state.announcement, "round-timeout");
});
