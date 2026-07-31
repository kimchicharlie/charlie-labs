import { Language } from "@/shared/types/language";
import type { CoachingKey } from "./audio/scoring";

export type GameTranslations = {
  learnToSing: string;
  title: string;
  introduction: string;
  exercise: string;
  oneNote: string;
  oneNoteDescription: string;
  melodyMemory: string;
  melodyDescription: string;
  difficulty: string;
  easy: string;
  easyDescription: string;
  hard: string;
  hardSingleDescription: string;
  hardMelodyDescription: string;
  play: string;
  microphoneNotice: string;
  preparingMicrophone: string;
  privacyNotice: string;
  round: string;
  level: string;
  of: string;
  pointsAbbreviation: string;
  targetNote: string;
  currentSlot: string;
  anyOctave: string;
  fromMemory: string;
  detectedNote: string;
  waiting: string;
  listen: string;
  hearTarget: string;
  yourTurn: string;
  yourTurnIn: string;
  getReady: string;
  singNow: string;
  startSinging: string;
  holdNote: string;
  nextNoteComing: string;
  finishNote: string;
  sustainedNote: string;
  singSteady: string;
  findNote: string;
  holdToValidate: string;
  onTarget: string;
  tooLow: string;
  tooHigh: string;
  review: string;
  timeUp: string;
  seeFinalScore: string;
  nextRound: string;
  nextLevel: string;
  finalScore: string;
  newPersonalBest: string;
  personalBest: string;
  playAgain: string;
  home: string;
  yinDetection: string;
  octaveIndependent: string;
  noRecording: string;
  microphoneUnsupported: string;
  microphoneBlocked: string;
  audioStartFailure: string;
  microphoneEnded: string;
  accuracy: string;
  stability: string;
  hold: string;
  averageOffset: string;
  roundCompleted: string;
  slotCompleted: string;
  slotCurrent: string;
  slotRemaining: string;
  corrections: string;
  coaching: Record<CoachingKey, string>;
  best: (score: number, maximum: number) => string;
  rememberNotes: (count: number) => string;
  notePosition: (position: number, total: number) => string;
  scorePoints: (score: number) => string;
  completedIn: (seconds: string) => string;
  timeUsed: (seconds: string) => string;
  secondsRemaining: (seconds: string) => string;
  finalAnnouncement: (score: number, maximum: number) => string;
};

export const gameTranslations: Record<Language, GameTranslations> = {
  en: {
    learnToSing: "Learn to sing",
    title: "Train your ear and voice",
    introduction:
      "Match pitch in any comfortable octave. Choose single notes or repeat a growing melody from memory.",
    exercise: "Exercise",
    oneNote: "One note",
    oneNoteDescription: "5 notes · 3 seconds each",
    melodyMemory: "Melody memory",
    melodyDescription: "Growing 2–6 note melody · sing it back at your pace",
    difficulty: "Difficulty",
    easy: "Easy",
    easyDescription: "Natural notes only",
    hard: "Hard",
    hardSingleDescription: "All 12 chromatic notes",
    hardMelodyDescription: "Pentatonic melodies with sharps",
    play: "Play",
    microphoneNotice: "Microphone permission requested only after Play.",
    preparingMicrophone: "Preparing microphone…",
    privacyNotice: "Voice stays in this browser.",
    round: "Round",
    level: "Level",
    of: "of",
    pointsAbbreviation: "pts",
    targetNote: "Target note",
    currentSlot: "Current slot",
    anyOctave: "Any octave",
    fromMemory: "from memory",
    detectedNote: "Detected note",
    waiting: "Waiting",
    listen: "Listen",
    hearTarget: "Hear the target note",
    yourTurn: "Your turn",
    yourTurnIn: "Your turn in",
    getReady: "Get ready to sing",
    singNow: "Sing now",
    startSinging: "Start singing",
    holdNote: "Hold the note",
    nextNoteComing: "Next note coming",
    finishNote: "Finish the note",
    sustainedNote: "One sustained note",
    singSteady: "Sing a steady note",
    findNote: "Find the note",
    holdToValidate: "Hold it steady",
    onTarget: "On target",
    tooLow: "Too low",
    tooHigh: "Too high",
    review: "Review",
    timeUp: "Time’s up",
    seeFinalScore: "See final score",
    nextRound: "Next round",
    nextLevel: "Next level",
    finalScore: "Final score",
    newPersonalBest: "New personal best",
    personalBest: "Personal best",
    playAgain: "Play again",
    home: "Home",
    yinDetection: "YIN pitch detection",
    octaveIndependent: "Octave-independent scoring",
    noRecording: "No audio recorded or uploaded",
    microphoneUnsupported: "Microphone access is not supported by this browser.",
    microphoneBlocked:
      "Microphone access was blocked. Allow it in your browser and try again.",
    audioStartFailure: "The audio game could not start. Please try another browser.",
    microphoneEnded: "The microphone became unavailable. Reconnect it and try again.",
    accuracy: "Accuracy",
    stability: "Stability",
    hold: "Hold",
    averageOffset: "Average offset",
    roundCompleted: "Round completed",
    slotCompleted: "Completed note",
    slotCurrent: "Current note",
    slotRemaining: "Remaining note",
    corrections: "Corrections",
    coaching: {
      "no-pitch": "No steady pitch was detected. Sing a little louder and hold the note.",
      "mostly-below": "You were mostly below the note.",
      "mostly-above": "You were mostly above the note.",
      "good-but-unstable": "Good accuracy, but try to keep the note steadier.",
      "quick-and-steady": "You found the note quickly and held it well.",
      "hold-longer": "You reached the note; try to hold it for longer.",
      "keep-steadier": "You are close. Keep your breath and pitch steadier.",
      "keep-practicing": "Good attempt. Aim for the center and sustain the note.",
    },
    best: (score, maximum) => `Best ${score} / ${maximum}`,
    rememberNotes: (count) => `Remember ${count} notes`,
    notePosition: (position, total) => `Note ${position} of ${total}`,
    scorePoints: (score) => `+${score} points`,
    completedIn: (seconds) => `Completed in ${seconds}s`,
    timeUsed: (seconds) => `Time used: ${seconds}s`,
    secondsRemaining: (seconds) => `${seconds} seconds remaining`,
    finalAnnouncement: (score, maximum) =>
      `Game completed. Final score ${score} out of ${maximum}.`,
  },
  fr: {
    learnToSing: "Apprendre à chanter",
    title: "Travaillez votre oreille et votre voix",
    introduction:
      "Reproduisez les notes dans l’octave qui vous convient. Chantez une note seule ou répétez de mémoire une mélodie progressive.",
    exercise: "Exercice",
    oneNote: "Une note",
    oneNoteDescription: "5 notes · 3 secondes chacune",
    melodyMemory: "Mémoire mélodique",
    melodyDescription: "Mélodie progressive de 2 à 6 notes · chantez à votre rythme",
    difficulty: "Difficulté",
    easy: "Facile",
    easyDescription: "Notes naturelles uniquement",
    hard: "Difficile",
    hardSingleDescription: "Les 12 notes chromatiques",
    hardMelodyDescription: "Mélodies pentatoniques avec des dièses",
    play: "Jouer",
    microphoneNotice: "L’autorisation du microphone est demandée après avoir cliqué sur Jouer.",
    preparingMicrophone: "Préparation du microphone…",
    privacyNotice: "Votre voix reste dans ce navigateur.",
    round: "Manche",
    level: "Niveau",
    of: "sur",
    pointsAbbreviation: "pts",
    targetNote: "Note cible",
    currentSlot: "Étape actuelle",
    anyOctave: "N’importe quelle octave",
    fromMemory: "de mémoire",
    detectedNote: "Note détectée",
    waiting: "En attente",
    listen: "Écoutez",
    hearTarget: "Écoutez la note cible",
    yourTurn: "À vous",
    yourTurnIn: "À vous dans",
    getReady: "Préparez-vous à chanter",
    singNow: "Chantez maintenant",
    startSinging: "Commencez à chanter",
    holdNote: "Tenez la note",
    nextNoteComing: "Prochaine note bientôt",
    finishNote: "Terminez la note",
    sustainedNote: "Une note tenue",
    singSteady: "Chantez une note stable",
    findNote: "Trouvez la note",
    holdToValidate: "Tenez-la stable",
    onTarget: "Juste",
    tooLow: "Trop grave",
    tooHigh: "Trop aigu",
    review: "Résultat",
    timeUp: "Temps écoulé",
    seeFinalScore: "Voir le score final",
    nextRound: "Manche suivante",
    nextLevel: "Niveau suivant",
    finalScore: "Score final",
    newPersonalBest: "Nouveau record personnel",
    personalBest: "Record personnel",
    playAgain: "Rejouer",
    home: "Accueil",
    yinDetection: "Détection de hauteur YIN",
    octaveIndependent: "Score indépendant de l’octave",
    noRecording: "Aucun son enregistré ni envoyé",
    microphoneUnsupported: "Ce navigateur ne prend pas en charge l’accès au microphone.",
    microphoneBlocked:
      "L’accès au microphone est bloqué. Autorisez-le dans votre navigateur, puis réessayez.",
    audioStartFailure: "Le jeu audio n’a pas pu démarrer. Essayez un autre navigateur.",
    microphoneEnded: "Le microphone n’est plus disponible. Reconnectez-le, puis réessayez.",
    accuracy: "Précision",
    stability: "Stabilité",
    hold: "Tenue",
    averageOffset: "Écart moyen",
    roundCompleted: "Manche terminée",
    slotCompleted: "Note réussie",
    slotCurrent: "Note actuelle",
    slotRemaining: "Note restante",
    corrections: "Corrections",
    coaching: {
      "no-pitch": "Aucune note stable n’a été détectée. Chantez un peu plus fort et tenez la note.",
      "mostly-below": "Vous étiez principalement en dessous de la note.",
      "mostly-above": "Vous étiez principalement au-dessus de la note.",
      "good-but-unstable": "Bonne précision, mais essayez de garder une note plus stable.",
      "quick-and-steady": "Vous avez trouvé la note rapidement et l’avez bien tenue.",
      "hold-longer": "Vous avez atteint la note ; essayez de la tenir plus longtemps.",
      "keep-steadier": "Vous êtes proche. Gardez un souffle et une hauteur plus stables.",
      "keep-practicing": "Bon essai. Visez le centre et prolongez la note.",
    },
    best: (score, maximum) => `Record ${score} / ${maximum}`,
    rememberNotes: (count) => `Mémorisez ${count} notes`,
    notePosition: (position, total) => `Note ${position} sur ${total}`,
    scorePoints: (score) => `+${score} points`,
    completedIn: (seconds) => `Terminé en ${seconds} s`,
    timeUsed: (seconds) => `Temps utilisé : ${seconds} s`,
    secondsRemaining: (seconds) => `${seconds} secondes restantes`,
    finalAnnouncement: (score, maximum) =>
      `Jeu terminé. Score final : ${score} sur ${maximum}.`,
  },
};
