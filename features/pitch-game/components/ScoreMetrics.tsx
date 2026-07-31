import React from "react";
import type { PitchScore } from "../audio/scoring";
import type { GameTranslations } from "../translations";

type ScoreMetricsProps = {
  metrics: PitchScore;
  copy: GameTranslations;
};

const ScoreMetrics = ({
  metrics,
  copy,
}: ScoreMetricsProps): React.JSX.Element => {
  const items = [
    { label: copy.accuracy, value: `${Math.round(metrics.accuracy)}%` },
    { label: copy.stability, value: `${Math.round(metrics.stability)}%` },
    { label: copy.hold, value: `${Math.round(metrics.onTargetPercentage)}%` },
    {
      label: copy.averageOffset,
      value: `${metrics.averageCentsDifference > 0 ? "+" : ""}${Math.round(
        metrics.averageCentsDifference,
      )}¢`,
    },
  ];

  return (
    <div>
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3 text-center"
          >
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              {item.label}
            </dt>
            <dd className="mt-1 text-lg font-bold text-white">{item.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 rounded-xl bg-primary-400/10 px-4 py-3 text-center text-sm text-primary-100">
        {copy.coaching[metrics.coachingKey]}
      </p>
    </div>
  );
};

export default ScoreMetrics;
