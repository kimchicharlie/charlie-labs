export type PitchSample = {
  frequency: number;
  timeMs: number;
  clarity: number;
};

export type CoachingKey =
  | "no-pitch"
  | "mostly-below"
  | "mostly-above"
  | "good-but-unstable"
  | "quick-and-steady"
  | "hold-longer"
  | "keep-steadier"
  | "keep-practicing";

export type PitchScore = {
  score: number;
  accuracy: number;
  stability: number;
  onTargetPercentage: number;
  onTargetDurationMs: number;
  voicedDurationMs: number;
  averageCentsDifference: number;
  averageAbsoluteCentsDifference: number;
  timeToTargetMs: number | null;
  representativeFrequency: number | null;
  sampleCount: number;
  coachingKey: CoachingKey;
};

export type ScorePitchOptions = {
  onTargetCents?: number;
  maximumSampleGapMs?: number;
  onsetGraceMs?: number;
};

export type PitchZone = "low" | "on-target" | "high";

export type MelodyRoundScore = {
  points: number;
  accuracy: number;
  time: number;
  corrections: number;
};

export type PitchWindowMetrics = {
  samples: PitchSample[];
  onTargetDurationMs: number;
};

const DEFAULT_ON_TARGET_CENTS = 25;
const DEFAULT_MAXIMUM_SAMPLE_GAP_MS = 100;

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(maximum, Math.max(minimum, value));

const roundMetric = (value: number): number => Math.round(value * 10) / 10;

export const median = (values: number[]): number | null => {
  const validValues = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (validValues.length === 0) return null;

  const middle = Math.floor(validValues.length / 2);
  return validValues.length % 2 === 0
    ? (validValues[middle - 1] + validValues[middle]) / 2
    : validValues[middle];
};

export const octaveIndependentCentsDifference = (
  frequency: number,
  targetFrequency: number,
): number | null => {
  if (
    !Number.isFinite(frequency) ||
    !Number.isFinite(targetFrequency) ||
    frequency <= 0 ||
    targetFrequency <= 0
  ) {
    return null;
  }

  const rawDifference = 1200 * Math.log2(frequency / targetFrequency);
  return ((rawDifference + 600) % 1200 + 1200) % 1200 - 600;
};

export const pitchZoneForFrequency = (
  frequency: number,
  targetFrequency: number,
  onTargetCents = DEFAULT_ON_TARGET_CENTS,
): PitchZone | null => {
  const difference = octaveIndependentCentsDifference(
    frequency,
    targetFrequency,
  );
  if (difference === null) return null;
  if (Math.abs(difference) <= onTargetCents) return "on-target";
  return difference < 0 ? "low" : "high";
};

export const latestPitchZone = (
  samples: PitchSample[],
  targetFrequency: number,
  elapsedMs: number,
  onTargetCents = DEFAULT_ON_TARGET_CENTS,
  staleAfterMs = 180,
): PitchZone | null => {
  const latestSample = samples[samples.length - 1];
  if (!latestSample || elapsedMs - latestSample.timeMs > staleAfterMs) {
    return null;
  }
  return pitchZoneForFrequency(
    latestSample.frequency,
    targetFrequency,
    onTargetCents,
  );
};

export const pitchWindowMetrics = (
  samples: PitchSample[],
  targetFrequency: number,
  elapsedMs: number,
  windowDurationMs: number,
  onTargetCents = DEFAULT_ON_TARGET_CENTS,
  maximumSampleGapMs = DEFAULT_MAXIMUM_SAMPLE_GAP_MS,
): PitchWindowMetrics => {
  const windowStartMs = Math.max(0, elapsedMs - windowDurationMs);
  const firstSampleInWindow = samples.findIndex(
    (sample) => sample.timeMs >= windowStartMs,
  );
  if (firstSampleInWindow < 0) {
    return { samples: [], onTargetDurationMs: 0 };
  }

  // Keep the preceding sample as an anchor for the small portion of time it
  // may represent inside the rolling window.
  const anchoredStart = Math.max(0, firstSampleInWindow - 1);
  const anchoredSamples = samples.slice(anchoredStart);
  let onTargetDurationMs = 0;

  anchoredSamples.forEach((sample, index) => {
    const nextTime = anchoredSamples[index + 1]?.timeMs ?? elapsedMs;
    const representedDuration = clamp(
      Math.min(elapsedMs, nextTime) - Math.max(windowStartMs, sample.timeMs),
      0,
      maximumSampleGapMs,
    );
    if (
      pitchZoneForFrequency(
        sample.frequency,
        targetFrequency,
        onTargetCents,
      ) === "on-target"
    ) {
      onTargetDurationMs += representedDuration;
    }
  });

  return {
    samples: samples.slice(firstSampleInWindow),
    onTargetDurationMs,
  };
};

export const scoreMelodyRound = ({
  noteScores,
  expectedNoteCount,
  elapsedMs,
  timeLimitMs,
  correctionCount,
  firstNoteCorrectionCount,
}: {
  noteScores: PitchScore[];
  expectedNoteCount: number;
  elapsedMs: number;
  timeLimitMs: number;
  correctionCount: number;
  firstNoteCorrectionCount: number;
}): MelodyRoundScore => {
  const noteCount = Math.max(1, expectedNoteCount);
  const completion = clamp(noteScores.length / noteCount, 0, 1);
  const accuracy =
    noteScores.length === 0
      ? 0
      : clamp(
          noteScores.reduce((sum, score) => sum + score.accuracy, 0) /
            noteScores.length,
          0,
          100,
        );
  // Finding the first note is deliberately generous; speed matters more once
  // the melody is underway.
  const fullCreditTimeMs = 2500 + Math.max(0, noteCount - 1) * 1000;
  const timeRangeMs = Math.max(1, timeLimitMs - fullCreditTimeMs);
  const time = clamp(
    100 -
      (Math.max(0, elapsedMs - fullCreditTimeMs) / timeRangeMs) * 60,
    40,
    100,
  );
  const weightedCorrections = Math.max(
    0,
    correctionCount - firstNoteCorrectionCount * 0.5,
  );
  const corrections = clamp(100 - weightedCorrections * 12, 0, 100);
  const scorePercentage =
    (accuracy * 0.65 + time * 0.2 + corrections * 0.15) * completion;

  return {
    points: Math.round((scorePercentage / 100) * noteCount * 100),
    accuracy: roundMetric(accuracy),
    time: roundMetric(time),
    corrections: roundMetric(corrections),
  };
};

const standardDeviation = (values: number[], average: number): number => {
  if (values.length < 2) return Number.POSITIVE_INFINITY;
  const variance =
    values.reduce((sum, value) => sum + (value - average) ** 2, 0) /
    values.length;
  return Math.sqrt(variance);
};

export const getCoachingKey = (
  metrics: Omit<PitchScore, "coachingKey">,
): CoachingKey => {
  if (metrics.sampleCount === 0) return "no-pitch";
  if (metrics.averageCentsDifference < -20) return "mostly-below";
  if (metrics.averageCentsDifference > 20) return "mostly-above";
  if (metrics.accuracy >= 80 && metrics.stability < 70) {
    return "good-but-unstable";
  }
  if (
    metrics.accuracy >= 80 &&
    metrics.stability >= 70 &&
    metrics.onTargetPercentage >= 65 &&
    metrics.timeToTargetMs !== null &&
    metrics.timeToTargetMs <= 600
  ) {
    return "quick-and-steady";
  }
  if (metrics.onTargetPercentage < 50) return "hold-longer";
  if (metrics.stability < 65) return "keep-steadier";
  return "keep-practicing";
};

export const scorePitchSamples = (
  samples: PitchSample[],
  targetFrequency: number,
  windowDurationMs: number,
  options: ScorePitchOptions = {},
): PitchScore => {
  const onTargetCents = options.onTargetCents ?? DEFAULT_ON_TARGET_CENTS;
  const maximumSampleGapMs =
    options.maximumSampleGapMs ?? DEFAULT_MAXIMUM_SAMPLE_GAP_MS;
  const safeWindowDuration = Math.max(0, windowDurationMs);
  const onsetGraceMs = clamp(
    options.onsetGraceMs ?? 0,
    0,
    safeWindowDuration,
  );
  const validSamples = samples
    .filter(
      (sample) =>
        Number.isFinite(sample.frequency) &&
        sample.frequency > 0 &&
        Number.isFinite(sample.timeMs) &&
        sample.timeMs >= 0 &&
        sample.timeMs <= safeWindowDuration,
    )
    .sort((first, second) => first.timeMs - second.timeMs);

  if (
    validSamples.length === 0 ||
    !Number.isFinite(targetFrequency) ||
    targetFrequency <= 0 ||
    safeWindowDuration === 0
  ) {
    const emptyMetrics: Omit<PitchScore, "coachingKey"> = {
      score: 0,
      accuracy: 0,
      stability: 0,
      onTargetPercentage: 0,
      onTargetDurationMs: 0,
      voicedDurationMs: 0,
      averageCentsDifference: 0,
      averageAbsoluteCentsDifference: 0,
      timeToTargetMs: null,
      representativeFrequency: null,
      sampleCount: 0,
    };
    return { ...emptyMetrics, coachingKey: getCoachingKey(emptyMetrics) };
  }

  const centsValues = validSamples.map((sample) =>
    octaveIndependentCentsDifference(sample.frequency, targetFrequency) ?? 0,
  );
  const averageCents =
    centsValues.reduce((sum, value) => sum + value, 0) / centsValues.length;
  const averageAbsoluteCents =
    centsValues.reduce((sum, value) => sum + Math.abs(value), 0) /
    centsValues.length;
  const centsDeviation = standardDeviation(centsValues, averageCents);
  const accuracy = clamp(100 - averageAbsoluteCents, 0, 100);
  const stability = Number.isFinite(centsDeviation)
    ? clamp(100 - centsDeviation * 2, 0, 100)
    : 0;

  let voicedDurationMs = 0;
  let onTargetDurationMs = 0;
  let timeToTargetMs: number | null = null;

  validSamples.forEach((sample, index) => {
    const nextTime =
      validSamples[index + 1]?.timeMs ?? safeWindowDuration;
    const representedDuration = clamp(
      nextTime - sample.timeMs,
      0,
      maximumSampleGapMs,
    );
    voicedDurationMs += representedDuration;

    if (Math.abs(centsValues[index]) <= onTargetCents) {
      onTargetDurationMs += representedDuration;
      timeToTargetMs ??= sample.timeMs;
    }
  });

  const onTargetPercentage = clamp(
    (onTargetDurationMs /
      Math.max(1, safeWindowDuration - onsetGraceMs)) *
      100,
    0,
    100,
  );
  const score = clamp(
    Math.round(accuracy * 0.45 + stability * 0.25 + onTargetPercentage * 0.3),
    0,
    100,
  );
  const baseMetrics: Omit<PitchScore, "coachingKey"> = {
    score,
    accuracy: roundMetric(accuracy),
    stability: roundMetric(stability),
    onTargetPercentage: roundMetric(onTargetPercentage),
    onTargetDurationMs: Math.round(onTargetDurationMs),
    voicedDurationMs: Math.round(voicedDurationMs),
    averageCentsDifference: roundMetric(averageCents),
    averageAbsoluteCentsDifference: roundMetric(averageAbsoluteCents),
    timeToTargetMs: timeToTargetMs === null ? null : Math.round(timeToTargetMs),
    representativeFrequency: median(
      validSamples.map((sample) => sample.frequency),
    ),
    sampleCount: validSamples.length,
  };

  return { ...baseMetrics, coachingKey: getCoachingKey(baseMetrics) };
};

export const summarizePitchScores = (scores: PitchScore[]): PitchScore => {
  if (scores.length === 0) return scorePitchSamples([], 440, 1);

  const average = (selector: (score: PitchScore) => number): number =>
    scores.reduce((sum, score) => sum + selector(score), 0) / scores.length;
  const totalSamples = scores.reduce(
    (sum, score) => sum + score.sampleCount,
    0,
  );
  const voicedScores = scores.filter((score) => score.sampleCount > 0);
  const voicedAverage = (selector: (score: PitchScore) => number): number =>
    voicedScores.length === 0
      ? 0
      : voicedScores.reduce((sum, score) => sum + selector(score), 0) /
        voicedScores.length;
  const baseMetrics: Omit<PitchScore, "coachingKey"> = {
    score: Math.round(average((score) => score.score)),
    accuracy: roundMetric(average((score) => score.accuracy)),
    stability: roundMetric(average((score) => score.stability)),
    onTargetPercentage: roundMetric(
      average((score) => score.onTargetPercentage),
    ),
    onTargetDurationMs: Math.round(
      scores.reduce((sum, score) => sum + score.onTargetDurationMs, 0),
    ),
    voicedDurationMs: Math.round(
      scores.reduce((sum, score) => sum + score.voicedDurationMs, 0),
    ),
    averageCentsDifference: roundMetric(
      voicedAverage((score) => score.averageCentsDifference),
    ),
    averageAbsoluteCentsDifference: roundMetric(
      voicedAverage((score) => score.averageAbsoluteCentsDifference),
    ),
    timeToTargetMs: median(
      scores
        .map((score) => score.timeToTargetMs)
        .filter((value): value is number => value !== null),
    ),
    representativeFrequency: median(
      scores
        .map((score) => score.representativeFrequency)
        .filter((value): value is number => value !== null),
    ),
    sampleCount: totalSamples,
  };

  return { ...baseMetrics, coachingKey: getCoachingKey(baseMetrics) };
};
