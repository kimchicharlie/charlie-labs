import assert from "node:assert/strict";
import test from "node:test";
import {
  median,
  octaveIndependentCentsDifference,
  pitchWindowMetrics,
  scoreMelodyRound,
  scorePitchSamples,
  summarizePitchScores,
} from "./scoring";

const frequencyAtCents = (target: number, cents: number): number =>
  target * 2 ** (cents / 1200);
const samplesForCents = (
  target: number,
  centsValues: number[],
  interval = 50,
) =>
  centsValues.map((cents, index) => ({
    frequency: frequencyAtCents(target, cents),
    timeMs: index * interval,
    clarity: 0.95,
  }));

const assertNearlyZero = (value: number | null): void => {
  assert.notEqual(value, null);
  if (value !== null) assert.ok(Math.abs(value) < 0.001);
};

test("median is safe for empty and invalid input", () => {
  assert.equal(median([]), null);
  assert.equal(median([Number.NaN]), null);
  assert.equal(median([1, 3, 2, 4]), 2.5);
});

test("octaves have zero cents difference", () => {
  assertNearlyZero(octaveIndependentCentsDifference(220, 440));
  assertNearlyZero(octaveIndependentCentsDifference(880, 440));
});

test("invalid frequencies cannot be interpreted as on target", () => {
  assert.equal(octaveIndependentCentsDifference(0, 440), null);
  assert.equal(octaveIndependentCentsDifference(Number.NaN, 440), null);
  assert.equal(octaveIndependentCentsDifference(440, -1), null);
});

test("empty singing window returns a zero score", () => {
  const result = scorePitchSamples([], 440, 1000);
  assert.equal(result.score, 0);
  assert.equal(result.sampleCount, 0);
  assert.equal(result.coachingKey, "no-pitch");
});

test("invalid samples are ignored and scores remain clamped", () => {
  const result = scorePitchSamples(
    [
      { frequency: Number.NaN, timeMs: 0, clarity: 1 },
      { frequency: -440, timeMs: 10, clarity: 1 },
      { frequency: 440, timeMs: 5000, clarity: 1 },
    ],
    440,
    1000,
  );
  assert.equal(result.score, 0);
  assert.ok(result.score >= 0 && result.score <= 100);
});

test("accurate sustained pitch scores near 100", () => {
  const samples = samplesForCents(440, Array(20).fill(0));
  const result = scorePitchSamples(samples, 440, 1000);
  assert.equal(result.score, 100);
  assert.equal(result.accuracy, 100);
  assert.equal(result.stability, 100);
  assert.equal(result.onTargetPercentage, 100);
  assert.equal(result.coachingKey, "quick-and-steady");
});

test("unstable pitch loses stability points", () => {
  const samples = samplesForCents(
    440,
    Array.from({ length: 20 }, (_, index) => (index % 2 ? 22 : -22)),
  );
  const result = scorePitchSamples(samples, 440, 1000);
  assert.ok(result.accuracy >= 75);
  assert.ok(result.stability < 60);
  assert.ok(result.score < 90);
});

test("on-target duration covers the full window rather than final samples", () => {
  const cents = [...Array(10).fill(0), ...Array(10).fill(70)];
  const result = scorePitchSamples(samplesForCents(440, cents), 440, 1000);
  assert.equal(result.onTargetDurationMs, 500);
  assert.equal(result.onTargetPercentage, 50);
  assert.ok(result.score > 0 && result.score < 100);
});

test("onset grace does not penalize normal singing reaction time", () => {
  const delayedPerfectSamples = samplesForCents(
    440,
    Array(29).fill(0),
  ).map((sample) => ({ ...sample, timeMs: sample.timeMs + 350 }));
  const result = scorePitchSamples(delayedPerfectSamples, 440, 1800, {
    onsetGraceMs: 350,
  });

  assert.equal(result.score, 100);
  assert.equal(result.onTargetPercentage, 100);
  assert.equal(result.timeToTargetMs, 350);
});

test("singing after the onset grace still loses hold credit", () => {
  const latePerfectSamples = samplesForCents(
    440,
    Array(19).fill(0),
  ).map((sample) => ({ ...sample, timeMs: sample.timeMs + 850 }));
  const result = scorePitchSamples(latePerfectSamples, 440, 1800, {
    onsetGraceMs: 350,
  });

  assert.ok(result.onTargetPercentage > 60);
  assert.ok(result.onTargetPercentage < 70);
  assert.ok(result.score < 100);
});

test("deterministic coaching reports sustained direction", () => {
  const below = scorePitchSamples(
    samplesForCents(440, Array(20).fill(-35)),
    440,
    1000,
  );
  assert.equal(below.coachingKey, "mostly-below");
});

test("round summary safely averages note metrics", () => {
  const perfect = scorePitchSamples(
    samplesForCents(440, Array(20).fill(0)),
    440,
    1000,
  );
  const low = scorePitchSamples([], 440, 1000);
  const summary = summarizePitchScores([perfect, low]);
  assert.equal(summary.score, 50);
  assert.equal(summary.accuracy, 50);
  assert.equal(summary.sampleCount, perfect.sampleCount);
});

test("melody rolling validation tolerates one brief pitch outlier", () => {
  const samples = samplesForCents(
    440,
    [0, 0, 0, 0, 60, 0, 0, 0, 0, 0, 0, 0],
    30,
  );
  const window = pitchWindowMetrics(samples, 440, 350, 350, 25);

  assert.equal(window.onTargetDurationMs, 320);
  assert.ok(window.onTargetDurationMs >= 260);
});

test("melody rolling validation rejects a mostly incorrect window", () => {
  const samples = samplesForCents(
    440,
    [0, 0, 60, 60, 60, 60, 0, 0, 60, 60, 60, 60],
    30,
  );
  const window = pitchWindowMetrics(samples, 440, 350, 350, 25);

  assert.ok(window.onTargetDurationMs < 260);
});

test("melody validation rejects a pitch that moved off target at the end", () => {
  const samples = samplesForCents(
    440,
    [...Array(27).fill(0), ...Array(9).fill(60)],
    10,
  );
  const fullWindow = pitchWindowMetrics(samples, 440, 350, 350, 25);
  const recentWindow = pitchWindowMetrics(samples, 440, 350, 100, 25);

  assert.ok(fullWindow.onTargetDurationMs >= 260);
  assert.ok(recentWindow.onTargetDurationMs < 60);
});

test("melody round scoring rewards speed and discounts first-note corrections", () => {
  const perfect = scorePitchSamples(
    samplesForCents(440, Array(20).fill(0)),
    440,
    1000,
  );
  const fast = scoreMelodyRound({
    noteScores: [perfect, perfect],
    expectedNoteCount: 2,
    elapsedMs: 3500,
    timeLimitMs: 14000,
    correctionCount: 0,
    firstNoteCorrectionCount: 0,
  });
  const correctedFirstNote = scoreMelodyRound({
    noteScores: [perfect, perfect],
    expectedNoteCount: 2,
    elapsedMs: 9000,
    timeLimitMs: 14000,
    correctionCount: 1,
    firstNoteCorrectionCount: 1,
  });
  const correctedLaterNote = scoreMelodyRound({
    noteScores: [perfect, perfect],
    expectedNoteCount: 2,
    elapsedMs: 9000,
    timeLimitMs: 14000,
    correctionCount: 1,
    firstNoteCorrectionCount: 0,
  });

  assert.equal(fast.points, 200);
  assert.ok(correctedFirstNote.points < fast.points);
  assert.ok(correctedFirstNote.points > correctedLaterNote.points);
});

test("incomplete melody rounds cannot earn a full completion score", () => {
  const perfect = scorePitchSamples(
    samplesForCents(440, Array(20).fill(0)),
    440,
    1000,
  );
  const result = scoreMelodyRound({
    noteScores: [perfect],
    expectedNoteCount: 4,
    elapsedMs: 20000,
    timeLimitMs: 20000,
    correctionCount: 0,
    firstNoteCorrectionCount: 0,
  });

  assert.ok(result.points > 0);
  assert.ok(result.points < 100);
});

test("missing notes do not make average pitch offset look more accurate", () => {
  const below = scorePitchSamples(
    samplesForCents(440, Array(20).fill(-18)),
    440,
    1000,
  );
  const missing = scorePitchSamples([], 440, 1000);
  const summary = summarizePitchScores([below, missing, missing]);

  assert.equal(summary.averageCentsDifference, -18);
  assert.equal(summary.averageAbsoluteCentsDifference, 18);
});
