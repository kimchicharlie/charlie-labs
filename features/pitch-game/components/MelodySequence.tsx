import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { noteNameWithoutOctave } from "../audio/notes";
import { type GameState, resultColorClasses } from "../gameState";
import type { GameTranslations } from "../translations";

type MelodySequenceProps = {
  copy: GameTranslations;
  state: GameState;
  reduceMotion: boolean;
};

const MelodySequence = ({
  copy,
  state,
  reduceMotion,
}: MelodySequenceProps): React.JSX.Element => (
  <div className="mb-4 flex flex-wrap justify-center gap-2 rounded-2xl border border-white/10 bg-black/15 p-4">
    {state.targetSequence.map((note, index) => {
      const result = state.noteResults[index];
      const revealTarget =
        state.phase === "reference" || state.phase === "round-result";
      const isCompleted =
        state.phase === "listening" && index < state.noteResults.length;
      const isCurrent =
        (state.phase === "preparing" || state.phase === "listening") &&
        index === state.activeNoteIndex &&
        !isCompleted;
      const resultClasses =
        state.phase === "round-result" && result
          ? resultColorClasses(result.pitch.score)
          : null;

      let slotState = "remaining";
      if (revealTarget) {
        slotState = "revealed";
      } else if (isCompleted) {
        slotState = "completed";
      } else if (isCurrent) {
        slotState = "current";
      }

      let slotLabel = copy.slotRemaining;
      if (revealTarget) {
        slotLabel = noteNameWithoutOctave(note.name);
      } else if (isCompleted) {
        slotLabel = copy.slotCompleted;
      } else if (isCurrent) {
        slotLabel = copy.slotCurrent;
      }

      const isHighlighted =
        isCurrent ||
        (state.phase === "reference" && index === state.activeNoteIndex);
      let slotClasses = "border-white/10 bg-white/[0.05] text-gray-500";
      if (resultClasses) {
        slotClasses = resultClasses;
      } else if (isCompleted) {
        slotClasses =
          "border-emerald-300/60 bg-emerald-400/20 text-emerald-200";
      } else if (isHighlighted) {
        slotClasses = "border-primary-300 bg-primary-400/20 text-white";
      }

      let slotContent: React.ReactNode = (
        <span className="h-3 w-3 rounded-full border border-gray-600" />
      );
      if (revealTarget) {
        slotContent = noteNameWithoutOctave(note.name);
      } else if (isCompleted) {
        slotContent = <Check className="h-5 w-5" strokeWidth={3} />;
      } else if (isCurrent) {
        slotContent = (
          <span className="h-3 w-3 rounded-full bg-primary-200 shadow-[0_0_12px_rgba(189,212,231,0.7)]" />
        );
      }

      return (
        <motion.div
          key={`${note.name}-${index}-${slotState}`}
          initial={
            reduceMotion || !isCompleted
              ? false
              : { opacity: 0.6, scale: 0.78 }
          }
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          aria-label={slotLabel}
          className={`flex h-12 min-w-12 items-center justify-center rounded-xl border px-3 font-bold ${slotClasses}`}
        >
          {slotContent}
        </motion.div>
      );
    })}
  </div>
);

export default MelodySequence;
