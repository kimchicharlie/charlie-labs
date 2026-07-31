export type MusicalNote = {
  name: string;
  frequency: number;
};

export type GameDifficulty = "easy" | "hard";

export const noteNameWithoutOctave = (noteName: string): string =>
  noteName.replace(/-?\d+$/, "");

const NOTE_NAMES = [
  "C",
  "C♯",
  "D",
  "D♯",
  "E",
  "F",
  "F♯",
  "G",
  "G♯",
  "A",
  "A♯",
  "B",
];

const EASY_TARGET_MIDI_NOTES = [55, 57, 59, 60, 62, 64, 65];
const HARD_TARGET_MIDI_NOTES = [55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66];
const EASY_MELODY_MIDI_NOTES = [55, 57, 60, 62, 64];
const HARD_MELODY_SCALES = [
  [56, 58, 60, 63, 65], // G-sharp major pentatonic
  [57, 59, 61, 64, 66], // A major pentatonic
  [59, 61, 63, 66, 68], // B major pentatonic
];

const midiToFrequency = (midiNote: number): number =>
  440 * 2 ** ((midiNote - 69) / 12);

const midiToName = (midiNote: number): string => {
  const octave = Math.floor(midiNote / 12) - 1;
  return `${NOTE_NAMES[midiNote % 12]}${octave}`;
};

export const createNoteSequence = (
  length: number,
  difficulty: GameDifficulty = "easy",
): MusicalNote[] => {
  const shuffledMidiNotes = [
    ...(difficulty === "easy"
      ? EASY_TARGET_MIDI_NOTES
      : HARD_TARGET_MIDI_NOTES),
  ];

  for (let index = shuffledMidiNotes.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledMidiNotes[index], shuffledMidiNotes[randomIndex]] = [
      shuffledMidiNotes[randomIndex],
      shuffledMidiNotes[index],
    ];
  }

  return shuffledMidiNotes.slice(0, length).map((midiNote) => ({
    name: midiToName(midiNote),
    frequency: midiToFrequency(midiNote),
  }));
};

export const createHarmoniousMelody = (
  length: number,
  difficulty: GameDifficulty = "easy",
  random: () => number = Math.random,
): MusicalNote[] => {
  if (length <= 0) return [];

  const melody: number[] = [];
  const melodyScale =
    difficulty === "easy"
      ? EASY_MELODY_MIDI_NOTES
      : HARD_MELODY_SCALES[
          Math.floor(random() * HARD_MELODY_SCALES.length)
        ];
  const stableStartingDegrees =
    difficulty === "easy"
      ? [0, 2, 4]
      : melodyScale.map((_, index) => index);
  let scaleIndex =
    stableStartingDegrees[
      Math.floor(random() * stableStartingDegrees.length)
    ];

  melody.push(melodyScale[scaleIndex]);

  while (melody.length < length) {
    // Adjacent scale steps appear twice, making singable motion more likely.
    const possibleSteps = [-1, -1, 1, 1, -2, 2].filter(
      (step) =>
        scaleIndex + step >= 0 && scaleIndex + step < melodyScale.length,
    );
    const step =
      possibleSteps[Math.floor(random() * possibleSteps.length)];
    scaleIndex += step;
    melody.push(melodyScale[scaleIndex]);
  }

  return melody.map((midiNote) => ({
    name: midiToName(midiNote),
    frequency: midiToFrequency(midiNote),
  }));
};

export const frequencyToNoteName = (frequency: number): string => {
  const midiNote = Math.round(69 + 12 * Math.log2(frequency / 440));
  return midiToName(midiNote);
};
