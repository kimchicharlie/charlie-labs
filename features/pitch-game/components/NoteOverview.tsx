import React from "react";
import {
  frequencyToNoteName,
  type MusicalNote,
  noteNameWithoutOctave,
} from "../audio/notes";
import { type GameState, resultColorClasses } from "../gameState";
import type { GameTranslations } from "../translations";

type NoteOverviewProps = {
  activeTarget: MusicalNote;
  copy: GameTranslations;
  state: GameState;
  detectedFrequency: number | null;
};

const NoteOverview = ({
  activeTarget,
  copy,
  state,
  detectedFrequency,
}: NoteOverviewProps): React.JSX.Element => {
  const displayFrequency =
    state.phase === "listening" || state.phase === "round-result"
      ? detectedFrequency
      : null;
  const singleResultClasses =
    state.mode === "single" &&
    state.phase === "round-result" &&
    state.noteResults[0]
      ? resultColorClasses(state.noteResults[0].pitch.score)
      : "border-white/10 bg-white/[0.06]";

  let currentSlotDescription = `${copy.of} ${state.targetSequence.length}`;
  if (state.mode === "single") {
    currentSlotDescription = copy.anyOctave;
  } else if (state.phase === "listening") {
    currentSlotDescription = `${currentSlotDescription} · ${copy.fromMemory}`;
  }

  const revealActiveTarget =
    state.mode === "single" ||
    state.phase === "reference" ||
    state.phase === "round-result";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className={`rounded-2xl border p-5 ${singleResultClasses}`}>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {state.mode === "single" ? copy.targetNote : copy.currentSlot}
        </p>
        <div className="mt-3 flex items-end gap-3">
          <span className="text-5xl font-bold text-white">
            {revealActiveTarget
              ? noteNameWithoutOctave(activeTarget.name)
              : state.activeNoteIndex + 1}
          </span>
          <span className="pb-1 text-sm text-gray-400">
            {currentSlotDescription}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {copy.detectedNote}
        </p>
        <div className="mt-3 flex items-end gap-3">
          <span className="text-5xl font-bold text-white">
            {displayFrequency ? frequencyToNoteName(displayFrequency) : "—"}
          </span>
          <span className="pb-1 text-sm text-gray-400">
            {displayFrequency
              ? `${displayFrequency.toFixed(1)} Hz`
              : copy.waiting}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NoteOverview;
