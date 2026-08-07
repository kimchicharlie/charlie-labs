import { Language } from "@/shared/types/language";

type ProjectCopy = {
  eyebrow: string;
  description: string;
  imageAlt: string;
  play: string;
  roleLabel: string;
  role: string;
  typeLabel: string;
  type: string;
  stackLabel: string;
  whatTitle: string;
  whatBody: string;
  featuresTitle: string;
  features: string[];
  howTitle: string;
  howBody: string;
  productTitle: string;
  productDetails: string[];
  builtTitle: string;
  builtBody: string;
};

export const projectTranslations: Record<Language, ProjectCopy> = {
  en: {
    eyebrow: "Personal project",
    description:
      "A browser-based singing exercise that turns microphone input into immediate, useful pitch feedback.",
    imageAlt: "Pitch Matching Game interface",
    play: "Play the game",
    roleLabel: "Role",
    role: "Product design and development",
    typeLabel: "Type",
    type: "Interactive browser game",
    stackLabel: "Stack",
    whatTitle: "What it does",
    whatBody:
      "Players hear a target note and reproduce it in a comfortable octave. The game listens through the microphone, evaluates pitch and stability, then gives concise feedback after each round.",
    featuresTitle: "Main features",
    features: [
      "Single-note and melody-memory exercises",
      "Easy and hard note sets",
      "Real-time pitch direction and hold feedback",
      "Round scoring and local personal bests",
    ],
    howTitle: "How it works",
    howBody:
      "Each round plays a reference note before opening a timed listening window. Audio is analysed locally in the browser, and the interface translates the result into note, direction, stability and score feedback.",
    productTitle: "Product details",
    productDetails: [
      "No audio is recorded or uploaded",
      "Scoring works across comfortable octaves",
      "Microphone access begins only after the player starts",
      "Reduced-motion preferences are respected",
    ],
    builtTitle: "How I built it",
    builtBody:
      "The interface is built with React and TypeScript. The Web Audio API handles playback and microphone input, while an AudioWorklet keeps analysis work away from the main interface thread. Game state and scoring are covered by deterministic tests.",
  },
  fr: {
    eyebrow: "Projet personnel",
    description:
      "Un exercice de chant dans le navigateur qui transforme l’entrée du microphone en retour immédiat et utile sur la justesse.",
    imageAlt: "Interface du jeu de reproduction de notes",
    play: "Jouer",
    roleLabel: "Rôle",
    role: "Conception produit et développement",
    typeLabel: "Type",
    type: "Jeu interactif dans le navigateur",
    stackLabel: "Technologies",
    whatTitle: "Fonctionnement",
    whatBody:
      "Les joueurs écoutent une note cible puis la reproduisent dans une octave confortable. Le jeu analyse le microphone, évalue la justesse et la stabilité, puis donne un retour concis après chaque manche.",
    featuresTitle: "Fonctionnalités principales",
    features: [
      "Exercices sur une note et de mémoire mélodique",
      "Sélections de notes faciles et difficiles",
      "Indications en temps réel sur la direction et la tenue",
      "Score par manche et records personnels locaux",
    ],
    howTitle: "Comment ça marche",
    howBody:
      "Chaque manche joue une note de référence avant d’ouvrir une fenêtre d’écoute limitée. Le son est analysé localement dans le navigateur, puis l’interface traduit le résultat en note, direction, stabilité et score.",
    productTitle: "Détails produit",
    productDetails: [
      "Aucun son n’est enregistré ni envoyé",
      "Le score fonctionne dans une octave confortable",
      "Le microphone ne démarre qu’après l’action du joueur",
      "Les préférences de réduction des animations sont respectées",
    ],
    builtTitle: "Réalisation",
    builtBody:
      "L’interface utilise React et TypeScript. La Web Audio API gère la lecture et le microphone, tandis qu’un AudioWorklet éloigne l’analyse du thread principal de l’interface. L’état du jeu et le calcul des scores sont couverts par des tests déterministes.",
  },
};
