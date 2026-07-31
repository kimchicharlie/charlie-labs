import React from "react";
import { Check, CheckCircle2, Clock3 } from "lucide-react";
import { noteNameWithoutOctave } from "../audio/notes";
import { summarizePitchScores } from "../audio/scoring";
import {
  GameMode,
  NoteResult,
  resultColorClasses,
  ROUND_COUNT,
} from "../gameState";
import { GameTranslations } from "../translations";
import ScoreMetrics from "./ScoreMetrics";

type RoundResultProps = {
  copy: GameTranslations;
  mode: GameMode;
  round: number;
  roundScore: number;
  elapsedMs: number;
  corrections: number;
  completed: boolean;
  noteResults: NoteResult[];
  onContinue: () => void;
};

const RoundResult = ({
  copy,
  mode,
  round,
  roundScore,
  elapsedMs,
  corrections,
  completed,
  noteResults,
  onContinue,
}: RoundResultProps): React.JSX.Element => {
  const summary = summarizePitchScores(
    noteResults.map((result) => result.pitch),
  );
  let continueLabel = copy.nextLevel;
  if (round === ROUND_COUNT) {
    continueLabel = copy.seeFinalScore;
  } else if (mode === "single") {
    continueLabel = copy.nextRound;
  }

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="flex flex-col items-center justify-center text-center">
        {completed ? (
          <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-300" />
        ) : (
          <Clock3 className="mb-2 h-8 w-8 text-amber-300" />
        )}
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
          {completed ? copy.review : copy.timeUp}
        </span>
        <span className="mt-2 text-2xl font-bold">
          {copy.scorePoints(roundScore)}
        </span>
      </div>

      <div className="mt-5">
        <ScoreMetrics metrics={summary} copy={copy} />
      </div>

      {mode === "melody" && (
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs font-semibold text-gray-300">
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5">
            {completed
              ? copy.completedIn((elapsedMs / 1000).toFixed(1))
              : copy.timeUsed((elapsedMs / 1000).toFixed(1))}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5">
            {copy.corrections}: {corrections}
          </span>
        </div>
      )}

      {mode === "melody" && (
        <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
          {noteResults.map((result, index) => (
            <span
              key={`${result.target.name}-${index}`}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 ${resultColorClasses(
                result.pitch.score,
              )}`}
              title={copy.coaching[result.pitch.coachingKey]}
            >
              {result.pitch.score >= 80 && <Check className="h-3 w-3" />}
              {noteNameWithoutOctave(result.target.name)} · {result.pitch.score}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={onContinue}
          className="rounded-xl bg-primary-500 px-5 py-2.5 font-semibold text-white transition hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          {continueLabel}
        </button>
      </div>
    </div>
  );
};

export default RoundResult;
