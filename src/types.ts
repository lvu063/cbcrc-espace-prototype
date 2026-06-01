// ============================================================
// Espace — TypeScript Type Definitions
// Author: Lê (Hai-Huong Le Vu)
// ============================================================
// Centralised type definitions for the Espace platform.
// In a production TypeScript codebase, these interfaces would be
// shared between the React frontend and the Node.js/Express backend,
// ensuring end-to-end type safety across the full stack.
//
// Migration path: rename .jsx files to .tsx, import these types,
// and add type annotations to component props and state.
// ============================================================

// --- BILINGUAL STRING ---
export interface BilingualString {
  fr: string;
  en: string;
}

export type Language = "fr" | "en";

export type ReputationLevel = "new" | "regular" | "expert";

export interface UserReputation {
  level: ReputationLevel;
  label: BilingualString;
  commentsCount: number;
  upvotesReceived: number;
}

// --- COMMENT ---
export interface Comment {
  id: string;
  articleId: string;
  author: string;
  avatar: string;
  content: BilingualString;
  language: "fr" | "en" | "franglais";
  timestamp: string;
  upvotes: number;
  seenBy: number;
  reputation: BilingualString;
  reputationLevel: ReputationLevel;
  approved: boolean;
  toxicityScore: number;
}

export interface CreateCommentInput {
  articleId: string;
  author: string;
  content: string;
  lang: Language;
}

// --- ARTICLE ---
export interface Article {
  id: string;
  slug: string;
  headline: BilingualString;
  summary: BilingualString;
  readCount: number;
  publishedAt: string;
  author: string;
  category: BilingualString;
}

// --- MODERATION ---
export interface FlaggedComment {
  id: string;
  author: string;
  avatar: string;
  content: BilingualString;
  toxicityScore: number;
  flags: number;
  aiLabel: BilingualString;
  aiSuggestion: BilingualString;
  timestamp: string;
}

export type ModerationAction = "approve" | "remove" | "escalate";

export interface ModerationDecision {
  commentId: string;
  action: ModerationAction;
  moderatorId: string;
  timestamp: string;
  note?: string;
}

// --- DEBATE ---
export type VoteChoice = "agree" | "disagree" | "nuanced";

export interface DebateCluster {
  id: string;
  label: BilingualString;
  size: number;
  color: string;
  x: number;
  y: number;
  description: BilingualString;
}

export interface DebateVote {
  statementId: string;
  choice: VoteChoice;
  lang: Language;
  timestamp: string;
}

// --- IMPACT ---
export interface ImpactStats {
  voicesHeard: number;
  languages: number;
  constructiveComments: number;
  activeCommunities: number;
}

export interface LanguageBreakdown {
  language: string;
  percentage: number;
  color: string;
}

export interface RecognitionUser {
  id: string;
  username: string;
  avatar: string;
  quote: BilingualString;
  level: BilingualString;
  highlight: boolean;
  comments: number;
}

// --- API RESPONSE WRAPPER ---
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// --- PERSPECTIVE API (toxicity scoring integration) ---
export interface PerspectiveScore {
  attributeScores: {
    TOXICITY: {
      summaryScore: { value: number; type: string };
    };
    SEVERE_TOXICITY?: {
      summaryScore: { value: number; type: string };
    };
    INSULT?: {
      summaryScore: { value: number; type: string };
    };
  };
  languages: string[];
  detectedLanguages: string[];
}

// --- FIREBASE REALTIME DATABASE SCHEMA ---
export interface FirebaseSchema {
  comments: {
    [articleId: string]: {
      [commentId: string]: Comment;
    };
  };
  flaggedComments: {
    [commentId: string]: FlaggedComment;
  };
  moderationLog: {
    [decisionId: string]: ModerationDecision;
  };
  debateVotes: {
    [statementId: string]: {
      [anonymousVoteId: string]: DebateVote;
    };
  };
  articles: {
    [articleId: string]: Article;
  };
  users: {
    [userId: string]: {
      username: string;
      reputation: UserReputation;
      joinedAt: string;
    };
  };
}
