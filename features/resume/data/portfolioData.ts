import { PortfolioData } from "@/shared/types/portfolio";

export const portfolioData: PortfolioData = {
  personalInfo: {
    name: "CHARLIE HENIN",
    title: {
      en: "FULL-STACK DEVELOPER",
      fr: "DÉVELOPPEUR FULL-STACK",
    },
    location: {
      en: "Montreal, QC, Canada",
      fr: "Montreal, QC, Canada",
    },
    about: {
      en: "Full-stack developer with 8+ years of experience building and modernizing web products with TypeScript, React and Node.js. Experienced in performance-constrained smart-TV and automotive environments, SaaS products and high-traffic platforms.",
      fr: "Développeur full-stack avec plus de 8 ans d'expérience dans la création et la modernisation de produits web avec TypeScript, React et Node.js. Expérience en environnements contraints (téléviseurs intelligents, automobile), produits SaaS et plateformes à fort trafic.",
    },
  },
  contact: {
    phone: "263 382 3007",
    email: "charlie.henin@gmail.com",
    website: "charliehenin.com",
    linkedin: "charlie-henin",
    github: "kimchicharlie",
  },
  experience: [
    {
      title: {
        en: "Full-Stack Developer",
        fr: "Développeur full-stack",
      },
      company: "STINGRAY",
      location: {
        en: "Montreal, QC, Canada",
        fr: "Montréal, QC, Canada",
      },
      period: {
        en: "Jul 2024 - Present",
        fr: "Juil 2024 - Présent",
      },
      description: {
        en: [
          "Leverage performance-oriented web technologies to build and deploy a CPU-intensive karaoke scoring game, now in production on Samsung Smart TVs and resource-constrained embedded platforms.",
          "Develop and maintain features for Stingray's music streaming platform using modern web technologies.",
          "Collaborate with Samsung to design and develop three PIRS applications for the Samsung VXT platform.",
          "Design, build, and deploy web applications and RESTful microservices across multiple technology stacks.",
          "Mentor junior developers and lead technical interviews for software engineering intern candidates, contributing to team growth and hiring decisions.",
        ],
        fr: [
          "Exploiter des technologies web haute performance pour concevoir et déployer un jeu de karaoké avec système de notation exigeant en ressources processeur, maintenant en production sur les téléviseurs connectés Samsung et des plateformes embarquées aux ressources limitées.",
          "Concevoir et maintenir des fonctionnalités pour la plateforme de diffusion musicale en continu de Stingray à l'aide de technologies web modernes.",
          "Collaborer avec Samsung à la conception et au développement de trois applications PIRS destinées à la plateforme Samsung VXT.",
          "Concevoir, développer et déployer des applications web et des microservices RESTful dans plusieurs écosystèmes technologiques.",
          "Encadrer des développeurs juniors et diriger les entretiens techniques de candidats à des stages en génie logiciel, contribuant à la croissance de l'équipe et aux décisions d'embauche.",
        ],
      },
      technologies: [
        "React",
        "TypeScript",
        "Node.js",
        "Next.js",
        "Lightning.js",
        "Service Workers",
        "AudioWorklet",
      ],
      type: "full-time",
    },
    {
      title: {
        en: "Full-Stack Developer",
        fr: "Développeur full-stack",
      },
      company: "BOTPRESS",
      location: {
        en: "Montreal, QC, Canada",
        fr: "Montréal, QC, Canada",
      },
      period: {
        en: "Jun 2023 - Jan 2024",
        fr: "Juin 2023 - Jan 2024",
      },
      description: {
        en: [
          "Owned end-to-end delivery of new features on Botpress Studio, the product where customers build and manage chatbots.",
          "Built and maintained open-source Botpress integrations.",
        ],
        fr: [
          "Pris en charge la livraison de nouvelles fonctionnalités sur Botpress Studio, le produit où les clients créent et gèrent leurs chatbots.",
          "Développé et maintenu les intégrations open source de Botpress.",
        ],
      },
      technologies: [
        "React",
        "TypeScript",
        "Node.js",
        "Next.js",
        "Supabase",
        "AWS",
        "Docker",
      ],
      type: "full-time",
    },
    {
      title: {
        en: "Full-Stack Developer",
        fr: "Développeur full-stack",
      },
      company: "MAPLR",
      location: {
        en: "Montreal, QC, Canada",
        fr: "Montréal, QC, Canada",
      },
      period: {
        en: "Feb 2023 - Jun 2023",
        fr: "Fév 2023 - Juin 2023",
      },
      description: {
        en: [
          "Built the frontend of an internal application from scratch using React, TypeScript, Zustand and React Query.",
          "Worked as a Maplr consultant at Intact, migrating applications to updated internal React component libraries.",
        ],
        fr: [
          "Développé de zéro le frontend d’une application interne avec React, TypeScript, Zustand et React Query.",
          "Intervenu chez Intact comme consultant Maplr afin de migrer des applications vers les nouvelles librairies internes de composants React.",
        ],
      },
      technologies: ["React", "TypeScript", "Zustand", "React Query"],
      type: "full-time",
    },
    {
      title: {
        en: "Full-Stack Developer",
        fr: "Développeur full-stack",
      },
      company: "BELLMAN",
      location: {
        en: "Paris, France (Remote)",
        fr: "Télétravail / Paris, France",
      },
      period: {
        en: "Oct 2020 - Jan 2023",
        fr: "Oct 2020 - Jan 2023",
      },
      description: {
        en: [
          "Built and deployed an OCR service to extract data from financial documents for property managers.",
          "Implemented automated payment scheduling with Node.js, React, Stripe and AWS Step Functions.",
          "Built an IVR system to route inbound calls to the appropriate Bellman service.",
          "Delivered remote voting on Bellman's property management platform for online general meetings.",
        ],
        fr: [
          "Développé et déployé un service OCR pour extraire des données de documents financiers pour les gestionnaires immobiliers.",
          "Implémenté un échéancier de prélèvements automatiques avec Node.js, React, Stripe et AWS Step Functions.",
          "Développé un IVR pour acheminer les appels entrants vers le bon service Bellman.",
          "Livré un système de vote à distance sur la plateforme de gestion immobilière Bellman pour les assemblées générales en ligne.",
        ],
      },
      technologies: [
        "Node.js",
        "React",
        "TypeScript",
        "Stripe",
        "AWS Step Functions",
        "GraphQL",
        "Prisma",
        "Next.js",
      ],
      type: "full-time",
    },
    {
      title: {
        en: "Full-Stack Developer",
        fr: "Développeur full-stack",
      },
      company: "SIGFOX",
      location: {
        en: "Labège, France",
        fr: "Labège, France",
      },
      period: {
        en: "Oct 2018 - Oct 2020",
        fr: "Oct 2018 - Oct 2020",
      },
      description: {
        en: [
          "Rewrote legacy Node.js REST API with Koa.",
          "Migrated applications from OVH to GCP Kubernetes infrastructure.",
          "Built and documented a shared React component library aligned with the Sigfox design system.",
        ],
        fr: [
          "Réécrit l'API REST legacy Node.js avec Koa.",
          "Migré les applications d'OVH vers une infrastructure Kubernetes sur GCP.",
          "Développé et documenté une librairie React partagée conforme au design system Sigfox.",
        ],
      },
      technologies: [
        "React",
        "Node.js",
        "Koa",
        "Kubernetes",
        "MongoDB",
        "Redis",
        "GraphQL",
        "GCP",
      ],
      type: "full-time",
    },
    {
      title: {
        en: "Full-Stack Developer",
        fr: "Développeur full-stack",
      },
      company: "MAESTRO CORPORATION",
      location: {
        en: "Toulouse, France",
        fr: "Toulouse, France",
      },
      period: {
        en: "Sep 2016 - Oct 2018",
        fr: "Sep 2016 - Oct 2018",
      },
      description: {
        en: [
          "Built high-traffic ticketing platforms and business applications with React and Node.js.",
          "Developed REST microservices and data-driven features using Express and MongoDB.",
        ],
        fr: [
          "Développé des plateformes de billetterie à fort trafic et des applications métier avec React et Node.js.",
          "Développé des microservices REST et des fonctionnalités orientées données avec Express et MongoDB.",
        ],
      },
      technologies: [
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "Redux",
        "Docker",
      ],
      type: "full-time",
    },
  ],
  education: [
    {
      degree: {
        en: "Expert in Information Technologies",
        fr: "Expert en Technologies de l'Information",
      },
      institution: "EPITECH",
      location: {
        en: "France",
        fr: "France",
      },
      period: {
        en: "2012 - 2017",
        fr: "2012 - 2017",
      },
      description: {
        en: [
          "Project-based curriculum in C, C++, Python, Java and systems programming.",
          "Toulouse Défi Numérique Dataviz Award — \"Où vont nos impôts ?\"",
        ],
        fr: [
          "Formation par projets en C, C++, Python, Java et programmation système.",
          "Prix Dataviz Toulouse Défi Numérique — « Où vont nos impôts ? »",
        ],
      },
      achievements: {
        en: ["Toulouse Défi Numérique Dataviz Award"],
        fr: ["Prix Dataviz Toulouse Défi Numérique"],
      },
    },
    {
      degree: {
        en: "Computer Science Exchange Program",
        fr: "Programme d’échange en informatique - niveau M1",
      },
      institution: "CHUNG-ANG UNIVERSITY",
      location: {
        en: "South Korea",
        fr: "Corée du Sud",
      },
      period: {
        en: "2015 - 2016",
        fr: "2015 - 2016",
      },
      description: {
        en: [
          "Exchange year: operating systems, software engineering, Korean language and culture.",
        ],
        fr: [
          "Année d'échange : systèmes d'exploitation, génie logiciel, langue et culture coréennes.",
        ],
      },
    },
  ],
  technologies: [
    { name: "TypeScript", category: "core" },
    { name: "React", category: "core" },
    { name: "Next.js", category: "core" },
    { name: "Node.js", category: "core" },
    { name: "GraphQL", category: "core" },
    { name: "PostgreSQL", category: "core" },
    { name: "MongoDB", category: "core" },
    { name: "AWS", category: "core" },
    { name: "Docker", category: "core" },
    { name: "Jest", category: "core" },
    { name: "Service Workers", category: "specialized" },
    { name: "WebAssembly", category: "specialized" },
    { name: "AudioWorklet", category: "specialized" },
  ],
  languages: {
    en: "French: Native | English: Professional",
    fr: "Français : langue maternelle | Anglais : professionnel",
  },
  interests: {
    en: "Soccer, hiking, travel, guitar and singing",
    fr: "Football, randonnée, voyages, guitare et chant",
  },
  hobbies: [],
};
