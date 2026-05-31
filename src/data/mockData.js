// ============================================================
// Espace — Mock Data
// Author: Lê (Hai-Huong Le Vu)
// ============================================================
// This file contains all mock data powering the Espace prototype.
// In a production environment, this would be replaced by:
// - A REST API or GraphQL endpoint
// - Firebase Realtime Database for live comment streaming
// - A moderation service (e.g. Perspective API by Google)
// - PostgreSQL for persistent user reputation data
// ============================================================

// --- ARTICLES ---
export const articles = [
  {
    id: "art-001",
    slug: "jeunes-franco-canadiens-identite",
    headline: {
      fr: "Les jeunes Franco-Canadiens redéfinissent leur identité linguistique",
      en: "Young Franco-Canadians are redefining their linguistic identity",
    },
    summary: {
      fr: "Une nouvelle génération de francophones hors Québec embrasse le franglais comme acte de résistance culturelle. Pour eux, mélanger les langues n'est pas une faiblesse — c'est une identité.",
      en: "A new generation of francophones outside Quebec is embracing franglais as an act of cultural resistance. For them, mixing languages is not a weakness — it is an identity.",
    },
    readCount: 12847,
    publishedAt: "2026-05-28T09:00:00Z",
    author: "Radio-Canada",
    category: { fr: "Société", en: "Society" },
  },
  {
    id: "art-002",
    slug: "financement-cbc-democratie",
    headline: {
      fr: "Le financement public de CBC Radio-Canada : pilier ou fardeau?",
      en: "CBC Radio-Canada public funding: pillar or burden?",
    },
    summary: {
      fr: "Alors que les débats politiques s'intensifient autour du financement de Radio-Canada, des experts en démocratie médiatique s'interrogent sur l'avenir du service public canadien.",
      en: "As political debates intensify around CBC funding, media democracy experts question the future of Canada's public broadcaster.",
    },
    readCount: 31204,
    publishedAt: "2026-05-27T14:30:00Z",
    author: "CBC News",
    category: { fr: "Politique", en: "Politics" },
  },
];

// --- COMMENTS ---
export const initialComments = [
  {
    id: "cmt-001",
    articleId: "art-001",
    author: "Marie-Soleil T.",
    avatar: "MS",
    content: {
      fr: "En tant que francophone en Ontario, je parle franglais tous les jours. Ce n'est pas de la paresse — c'est ma réalité. Merci à CBC de finally covering this.",
      en: "As a francophone in Ontario, I speak franglais every day. It's not laziness — it's my reality. Merci à CBC de finally covering this.",
    },
    language: "franglais",
    timestamp: "2026-05-28T10:14:00Z",
    upvotes: 47,
    seenBy: 1203,
    reputation: { fr: "Contributrice régulière", en: "Regular Contributor" },
    reputationLevel: "expert",
    approved: true,
    toxicityScore: 0.02,
  },
  {
    id: "cmt-002",
    articleId: "art-001",
    author: "Jean-François B.",
    avatar: "JB",
    content: {
      fr: "C'est exactement ce dont on avait besoin comme conversation. La langue n'est pas figée — elle vit, elle respire, elle s'adapte. Bravo pour cet article.",
      en: "This is exactly the conversation we needed. Language is not fixed — it lives, breathes, and adapts. Great article.",
    },
    language: "fr",
    timestamp: "2026-05-28T10:32:00Z",
    upvotes: 31,
    seenBy: 892,
    reputation: { fr: "Expert communautaire", en: "Community Expert" },
    reputationLevel: "expert",
    approved: true,
    toxicityScore: 0.01,
  },
  {
    id: "cmt-003",
    articleId: "art-001",
    author: "Priya N.",
    avatar: "PN",
    content: {
      fr: "I learned French as my third language too. Spaces like this where mistakes are welcome made all the difference for me. Keep going.",
      en: "I learned French as my third language too. Spaces like this where mistakes are welcome made all the difference for me. Keep going.",
    },
    language: "en",
    timestamp: "2026-05-28T11:05:00Z",
    upvotes: 28,
    seenBy: 744,
    reputation: { fr: "Nouveau membre", en: "New Member" },
    reputationLevel: "new",
    approved: true,
    toxicityScore: 0.01,
  },
  {
    id: "cmt-004",
    articleId: "art-001",
    author: "Dominique L.",
    avatar: "DL",
    content: {
      fr: "Le franglais, c'est notre identité collective. On n'a pas à choisir entre deux cultures — on est les deux à la fois.",
      en: "Franglais is our collective identity. We don't have to choose between two cultures — we are both at the same time.",
    },
    language: "fr",
    timestamp: "2026-05-28T11:47:00Z",
    upvotes: 19,
    seenBy: 521,
    reputation: { fr: "Contributeur régulier", en: "Regular Contributor" },
    reputationLevel: "regular",
    approved: true,
    toxicityScore: 0.03,
  },
];

// --- FLAGGED COMMENTS FOR MODERATION ---
export const flaggedComments = [
  {
    id: "flag-001",
    author: "user_anonymous_44",
    avatar: "?",
    content: {
      fr: "Encore de l'argent gaspillé pour Radio-Canada. Personne ne regarde ça de toute façon. C'est une honte.",
      en: "More wasted money for Radio-Canada. Nobody watches this anyway. It's a disgrace.",
    },
    toxicityScore: 0.71,
    flags: 3,
    aiLabel: { fr: "Ton agressif", en: "Aggressive tone" },
    aiSuggestion: {
      fr: "Ce commentaire contient un langage négatif généralisé sans argument constructif.",
      en: "This comment contains broad negative language without constructive argument.",
    },
    timestamp: "2026-05-28T09:22:00Z",
  },
  {
    id: "flag-002",
    author: "marc_qc_1987",
    avatar: "MQ",
    content: {
      fr: "Question intéressante mais l'article ne mentionne pas du tout les données de Statistique Canada sur le déclin du français. Hors sujet pour un débat sérieux.",
      en: "Interesting question but the article doesn't mention Statistics Canada data on French decline at all. Off-topic for serious debate.",
    },
    toxicityScore: 0.18,
    flags: 1,
    aiLabel: { fr: "Hors sujet", en: "Off-topic" },
    aiSuggestion: {
      fr: "Commentaire critique mais constructif. Pourrait bénéficier d'un réacheminement vers un article plus pertinent.",
      en: "Critical but constructive comment. Could benefit from redirection to a more relevant article.",
    },
    timestamp: "2026-05-28T10:08:00Z",
  },
  {
    id: "flag-003",
    author: "sophie_tdot",
    avatar: "ST",
    content: {
      fr: "Ce débat sur le franglais me touche vraiment. J'ai grandi en parlant les deux et je me suis toujours sentie entre deux mondes. Merci de normaliser ça.",
      en: "This franglais debate really touches me. I grew up speaking both and always felt between two worlds. Thanks for normalizing this.",
    },
    toxicityScore: 0.04,
    flags: 1,
    aiLabel: { fr: "Contenu de qualité", en: "Quality content" },
    aiSuggestion: {
      fr: "Faux positif probable — commentaire empathique et pertinent. Recommande approbation.",
      en: "Likely false positive — empathetic and relevant comment. Recommend approval.",
    },
    timestamp: "2026-05-28T10:55:00Z",
  },
];

// --- DEBATE DATA ---
export const debateStatement = {
  fr: "Le financement public de CBC Radio-Canada est essentiel pour la démocratie canadienne.",
  en: "Public funding for CBC Radio-Canada is essential for Canadian democracy.",
};

export const debateClusters = [
  {
    id: "cluster-1",
    label: { fr: "Partisans du service public", en: "Public service supporters" },
    size: 67,
    color: "#CC0000",
    x: 30,
    y: 35,
    description: {
      fr: "S'accordent sur l'importance d'une voix canadienne indépendante",
      en: "Agree on the importance of an independent Canadian voice",
    },
  },
  {
    id: "cluster-2",
    label: { fr: "Partisans du marché libre", en: "Free market advocates" },
    size: 21,
    color: "#666666",
    x: 70,
    y: 65,
    description: {
      fr: "Préfèrent un modèle financé par la publicité ou les abonnements",
      en: "Prefer an advertising or subscription-funded model",
    },
  },
  {
    id: "cluster-3",
    label: { fr: "Position nuancée", en: "Nuanced position" },
    size: 12,
    color: "#E8A020",
    x: 52,
    y: 45,
    description: {
      fr: "Soutiennent un financement partiel avec plus de transparence",
      en: "Support partial funding with greater transparency",
    },
  },
];

export const consensusInsight = {
  fr: "67% des participants s'accordent sur la valeur de la diversité des voix canadiennes, indépendamment de leur position sur le financement.",
  en: "67% of participants agree on the value of diverse Canadian voices, regardless of their position on funding.",
};

// --- IMPACT STATS ---
export const impactStats = {
  voicesHeard: 12847,
  languages: 3,
  constructiveComments: 89,
  activeCommunities: 47,
};

export const languageBreakdown = [
  { language: "Français", percentage: 58, color: "#CC0000" },
  { language: "English", percentage: 31, color: "#1B1E2B" },
  { language: "Franglais", percentage: 11, color: "#E8A020" },
];

export const recognitionWall = [
  {
    id: "rec-001",
    username: "Marie-Soleil T.",
    avatar: "MS",
    quote: {
      fr: "Le franglais, c'est ma réalité — pas ma faiblesse.",
      en: "Franglais is my reality — not my weakness.",
    },
    level: { fr: "Contributrice de la semaine 🏆", en: "Contributor of the week 🏆" },
    highlight: true,
    comments: 23,
  },
  {
    id: "rec-002",
    username: "Jean-François B.",
    avatar: "JB",
    quote: {
      fr: "La langue vit, respire, s'adapte.",
      en: "Language lives, breathes, adapts.",
    },
    level: { fr: "Expert communautaire", en: "Community Expert" },
    highlight: false,
    comments: 18,
  },
  {
    id: "rec-003",
    username: "Priya N.",
    avatar: "PN",
    quote: {
      fr: "Les espaces bienveillants changent tout.",
      en: "Welcoming spaces change everything.",
    },
    level: { fr: "Nouveau membre", en: "New Member" },
    highlight: false,
    comments: 7,
  },
  {
    id: "rec-004",
    username: "Dominique L.",
    avatar: "DL",
    quote: {
      fr: "On n'a pas à choisir — on est les deux.",
      en: "We don't have to choose — we are both.",
    },
    level: { fr: "Contributeur régulier", en: "Regular Contributor" },
    highlight: false,
    comments: 14,
  },
  {
    id: "rec-005",
    username: "sophie_tdot",
    avatar: "ST",
    quote: {
      fr: "Entre deux mondes, mais enfin chez moi.",
      en: "Between two worlds, but finally home.",
    },
    level: { fr: "Contributrice régulière", en: "Regular Contributor" },
    highlight: false,
    comments: 11,
  },
  {
    id: "rec-006",
    username: "marc_qc_1987",
    avatar: "MQ",
    quote: {
      fr: "Les données racontent une histoire — écoutons-les.",
      en: "Data tells a story — let's listen.",
    },
    level: { fr: "Expert communautaire", en: "Community Expert" },
    highlight: false,
    comments: 9,
  },
];
