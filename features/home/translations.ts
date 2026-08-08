import { Language } from "@/shared/types/language";

export type HomeCopy = {
  location: string;
  heroTitle: string;
  heroDescription: string;
  viewWork: string;
  downloadResume: string;
  projectsExperiments: string;
  projectImageAlt: string;
  projectDescription: string;
  projectMetadata: string;
  playGame: string;
  projectDetails: string;
  selectedExperience: string;
  experienceDescriptions: Record<string, string>;
  viewFullResume: string;
  about: string;
  aboutParagraphs: string[];
  personalNote: string;
  technologies: string;
  core: string;
  platforms: string;
  infrastructure: string;
};

export const homeTranslations: Record<Language, HomeCopy> = {
  en: {
    location: "Montreal, Canada",
    heroTitle: "Full-stack developer focused on product and performance.",
    heroDescription:
      "8+ years of experience with React, TypeScript and Node.js across SaaS, music products and performance-constrained environments.",
    viewWork: "View my work",
    downloadResume: "Download résumé",
    projectsExperiments: "Projects & experiments",
    projectImageAlt: "Pitch Matching Game interface",
    projectDescription:
      "A small browser game where players listen to a note and try to reproduce it using their microphone.",
    projectMetadata: "Personal project · AI-assisted",
    playGame: "Play",
    projectDetails: "Details",
    selectedExperience: "Selected experience",
    experienceDescriptions: {
      STINGRAY: "Web applications for music, Smart TVs and embedded platforms.",
      BOTPRESS: "Product development for a SaaS platform used to build and manage AI agents and chatbots.",
      BELLMAN: "Property-management products, payments and internal automation.",
      SIGFOX: "Shared web platforms, APIs and design-system infrastructure.",
    },
    viewFullResume: "View full résumé",
    about: "About",
    aboutParagraphs: [
      "I’m a full-stack developer based in Montreal with 8+ years of experience building web products across SaaS, high-traffic applications and performance-constrained platforms.",
      "I mostly work with TypeScript, React and Node.js and enjoy solving problems that sit between product, frontend, backend and browser capabilities.",
    ],
    personalNote: "Outside software, I’m usually playing football, travelling, playing guitar or trying to sing reasonably in tune.",
    technologies: "Technologies",
    core: "Core",
    platforms: "Web & platforms",
    infrastructure: "Infrastructure",
  },
  fr: {
    location: "Montréal, Canada",
    heroTitle: "Développeur full-stack axé sur le produit et la performance.",
    heroDescription:
      "Plus de 8 ans d’expérience avec React, TypeScript et Node.js dans le SaaS, les produits musicaux et les environnements aux ressources limitées.",
    viewWork: "Voir mes projets",
    downloadResume: "Télécharger mon CV",
    projectsExperiments: "Projets et expérimentations",
    projectImageAlt: "Interface du jeu de reproduction de notes",
    projectDescription:
      "Un petit jeu dans le navigateur où les joueurs écoutent une note puis tentent de la reproduire avec leur microphone.",
    projectMetadata: "Projet personnel · Assisté par IA",
    playGame: "Jouer",
    projectDetails: "Détails",
    selectedExperience: "Expérience sélectionnée",
    experienceDescriptions: {
      STINGRAY: "Applications web pour la musique, les téléviseurs intelligents et les plateformes embarquées.",
      BOTPRESS: "Développement produit pour une plateforme SaaS de création et de gestion d’agents IA et de chatbots.",
      BELLMAN: "Produits de gestion immobilière, paiements et automatisation interne.",
      SIGFOX: "Plateformes web partagées, API et infrastructure de design system.",
    },
    viewFullResume: "Voir le CV complet",
    about: "À propos",
    aboutParagraphs: [
      "Je suis développeur full-stack à Montréal avec plus de 8 ans d’expérience dans la création de produits web pour le SaaS, les applications à fort trafic et les plateformes aux ressources limitées.",
      "Je travaille principalement avec TypeScript, React et Node.js et j’aime résoudre des problèmes qui se situent entre le produit, le frontend, le backend et les capacités du navigateur.",
    ],
    personalNote: "En dehors du logiciel, je joue généralement au football, je voyage, je joue de la guitare ou j’essaie de chanter à peu près juste.",
    technologies: "Technologies",
    core: "Principales",
    platforms: "Web et plateformes",
    infrastructure: "Infrastructure",
  },
};
