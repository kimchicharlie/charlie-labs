import React from "react";
import type { GameState } from "../gameState";
import type { GameTranslations } from "../translations";
import PitchMeter from "./PitchMeter";

type ListeningPanelProps = {
  copy: GameTranslations;
  state: GameState;
  centsDifference: number | null;
  pitchStatus: string;
  isOnTarget: boolean;
  progress: number;
  formattedTimeRemaining: string;
};

const ListeningPanel = ({
  copy,
  state,
  centsDifference,
  pitchStatus,
  isOnTarget,
  progress,
  formattedTimeRemaining,
}: ListeningPanelProps): React.JSX.Element => {
  let instruction = copy.finishNote;
  if (state.mode === "melody") {
    if (centsDifference === null) {
      instruction = copy.findNote;
    } else if (isOnTarget) {
      instruction = copy.holdToValidate;
    } else {
      instruction = pitchStatus;
    }
  } else if (state.singingCue === "start") {
    instruction = copy.startSinging;
  } else if (state.singingCue === "hold") {
    instruction = copy.holdNote;
  } else if (state.activeNoteIndex < state.targetSequence.length - 1) {
    instruction = copy.nextNoteComing;
  }

  let pitchStatusClasses = "bg-amber-400/15 text-amber-200";
  if (isOnTarget) {
    pitchStatusClasses = "bg-emerald-400/15 text-emerald-300";
  } else if (centsDifference === null) {
    pitchStatusClasses = "bg-white/10 text-gray-300";
  }

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-emerald-400/[0.08] p-5 sm:px-7">
      <div className="grid min-h-36 gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center gap-3 sm:justify-start">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
              {state.mode === "melody" ? copy.yourTurn : copy.singNow}
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-white">{instruction}</p>
          <p className="mt-2 text-sm text-emerald-100/70">
            {state.mode === "single"
              ? copy.sustainedNote
              : copy.notePosition(
                  state.activeNoteIndex + 1,
                  state.targetSequence.length,
                )}
          </p>
          <span
            className={`mt-4 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${pitchStatusClasses}`}
          >
            {pitchStatus}
          </span>
        </div>

        <div
          className="relative mx-auto grid h-24 w-24 shrink-0 place-items-center rounded-full"
          style={{
            background: `conic-gradient(#34d399 ${progress}%, rgba(255,255,255,0.08) 0)`,
          }}
          aria-hidden="true"
        >
          <div className="absolute inset-2 rounded-full bg-gray-900" />
          <span className="relative text-2xl font-black text-white">
            {formattedTimeRemaining}
          </span>
        </div>
      </div>

      <PitchMeter
        centsDifference={centsDifference}
        lowLabel={copy.tooLow}
        targetLabel={copy.onTarget}
        highLabel={copy.tooHigh}
      />
    </div>
  );
};

export default ListeningPanel;
