// ============================================================
// Espace — Express.js REST API Server
// Author: Lê (Hai-Huong Le Vu)
// ============================================================
// Node.js/Express backend that serves the Espace data layer.
// This demonstrates the ability to build and consume API endpoints
// as required by the CBC Radio-Canada Full Stack Developer role.
//
// In production this would:
// - Connect to Firebase Realtime Database instead of mock data
// - Integrate Google Perspective API for real toxicity scoring
// - Add JWT authentication middleware
// - Deploy on a Node.js runtime (e.g. Railway, Render, or CBC's infra)
//
// Run locally:
//   npm install
//   node server.js
//   → API available at http://localhost:3001
// ============================================================

const express  = require("express");
const cors     = require("cors");

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ── In-memory data store (replace with Firebase in production) ──
const { articles, initialComments, flaggedComments } = require("./src/data/mockData.cjs");

let comments      = [...initialComments];
let flagged       = [...flaggedComments];
let moderationLog = [];

// ============================================================
// MIDDLEWARE
// ============================================================

// Request logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// API response wrapper
const apiResponse = (data, error = null) => ({
  success: !error,
  data:    error ? undefined : data,
  error:   error || undefined,
  timestamp: new Date().toISOString(),
});

// ============================================================
// ROUTES — ARTICLES
// ============================================================

// GET /api/articles — list all articles
app.get("/api/articles", (req, res) => {
  res.json(apiResponse(articles));
});

// GET /api/articles/:id — get single article
app.get("/api/articles/:id", (req, res) => {
  const article = articles.find((a) => a.id === req.params.id);
  if (!article) return res.status(404).json(apiResponse(null, "Article not found"));
  res.json(apiResponse(article));
});

// ============================================================
// ROUTES — COMMENTS
// ============================================================

// GET /api/comments?articleId=art-001 — get comments for an article
app.get("/api/comments", (req, res) => {
  const { articleId } = req.query;
  const result = articleId
    ? comments.filter((c) => c.articleId === articleId && c.approved)
    : comments.filter((c) => c.approved);
  res.json(apiResponse(result));
});

// POST /api/comments — create a new comment
// Body: { articleId, author, content, lang }
app.post("/api/comments", async (req, res) => {
  const { articleId, author, content, lang } = req.body;

  // Input validation
  if (!articleId || !author || !content) {
    return res.status(400).json(apiResponse(null, "articleId, author, and content are required"));
  }
  if (content.length > 280) {
    return res.status(400).json(apiResponse(null, "Comment exceeds 280 character limit"));
  }

  // ── Toxicity scoring ──
  // In production: call Google Perspective API
  // const toxicityScore = await scoreToxicity(content);
  //
  // POST https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze
  // Body: {
  //   comment: { text: content },
  //   languages: [lang],
  //   requestedAttributes: { TOXICITY: {}, SEVERE_TOXICITY: {} }
  // }
  // Returns: PerspectiveScore (see types.ts)
  const toxicityScore = simulateToxicityScore(content); // mock for demo

  // Language detection
  const frenchWords   = ["je","tu","nous","les","des","est","une","avec","merci","bonjour","mais","pour"];
  const words         = content.toLowerCase().split(/\s+/);
  const hasFrench     = words.some((w) => frenchWords.includes(w));
  const hasEnglish    = words.some((w) => ["the","and","is","in","it","you","this","that"].includes(w));
  const detectedLang  = hasFrench && hasEnglish ? "franglais" : hasFrench ? "fr" : "en";

  const newComment = {
    id:             `cmt-${Date.now()}`,
    articleId,
    author,
    avatar:         author.slice(0, 2).toUpperCase(),
    content:        { fr: content, en: content },
    language:       detectedLang,
    timestamp:      new Date().toISOString(),
    upvotes:        0,
    seenBy:         1,
    reputation:     { fr: "Nouveau membre", en: "New Member" },
    reputationLevel:"new",
    approved:       toxicityScore < 0.5,  // auto-approve if low toxicity
    toxicityScore,
  };

  // Route to moderation queue if toxicity is high
  if (toxicityScore >= 0.5) {
    flagged.push({
      id:           newComment.id,
      author,
      avatar:       newComment.avatar,
      content:      newComment.content,
      toxicityScore,
      flags:        1,
      aiLabel:      { fr: "Révision requise", en: "Review required" },
      aiSuggestion: { fr: "Score de toxicité élevé — révision humaine recommandée.",
                      en: "High toxicity score — human review recommended." },
      timestamp:    newComment.timestamp,
    });
    return res.status(202).json(apiResponse({
      ...newComment,
      message: { fr: "Votre commentaire est en attente de modération.",
                 en: "Your comment is pending moderation." }
    }));
  }

  comments.unshift(newComment);
  res.status(201).json(apiResponse(newComment));
});

// POST /api/comments/:id/upvote — upvote a comment
app.post("/api/comments/:id/upvote", (req, res) => {
  const comment = comments.find((c) => c.id === req.params.id);
  if (!comment) return res.status(404).json(apiResponse(null, "Comment not found"));
  comment.upvotes += 1;
  res.json(apiResponse(comment));
});

// ============================================================
// ROUTES — MODERATION
// ============================================================

// GET /api/moderation/queue — get flagged comments queue
app.get("/api/moderation/queue", (req, res) => {
  res.json(apiResponse(flagged));
});

// POST /api/moderation/:id — take action on a flagged comment
// Body: { action: "approve" | "remove" | "escalate", moderatorId, note? }
app.post("/api/moderation/:id", (req, res) => {
  const { action, moderatorId, note } = req.body;
  if (!["approve", "remove", "escalate"].includes(action)) {
    return res.status(400).json(apiResponse(null, "Invalid action"));
  }
  const flaggedComment = flagged.find((c) => c.id === req.params.id);
  if (!flaggedComment) return res.status(404).json(apiResponse(null, "Flagged comment not found"));

  // Log the decision
  const decision = {
    commentId:   req.params.id,
    action,
    moderatorId: moderatorId || "anonymous",
    timestamp:   new Date().toISOString(),
    note:        note || null,
  };
  moderationLog.push(decision);

  // Apply action
  if (action === "approve") {
    const original = comments.find((c) => c.id === req.params.id);
    if (original) original.approved = true;
  }
  flagged = flagged.filter((c) => c.id !== req.params.id);

  res.json(apiResponse({ decision, queueLength: flagged.length }));
});

// GET /api/moderation/log — get moderation history
app.get("/api/moderation/log", (req, res) => {
  res.json(apiResponse(moderationLog));
});

// ============================================================
// ROUTES — DEBATE
// ============================================================

// In-memory vote store (replace with Firebase in production)
const votes = { agree: 4821, disagree: 1523, nuanced: 867 };

// GET /api/debate/votes — get current vote counts
app.get("/api/debate/votes", (req, res) => {
  const total = Object.values(votes).reduce((a, b) => a + b, 0);
  res.json(apiResponse({
    votes,
    total,
    percentages: Object.fromEntries(
      Object.entries(votes).map(([k, v]) => [k, Math.round(v / total * 100)])
    )
  }));
});

// POST /api/debate/vote — submit a vote
// Body: { choice: "agree" | "disagree" | "nuanced", lang }
app.post("/api/debate/vote", (req, res) => {
  const { choice } = req.body;
  if (!["agree", "disagree", "nuanced"].includes(choice)) {
    return res.status(400).json(apiResponse(null, "Invalid choice"));
  }
  votes[choice] += 1;
  const total = Object.values(votes).reduce((a, b) => a + b, 0);
  res.json(apiResponse({ votes, total }));
});

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "espace-api",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: [
      "GET  /api/articles",
      "GET  /api/articles/:id",
      "GET  /api/comments?articleId=",
      "POST /api/comments",
      "POST /api/comments/:id/upvote",
      "GET  /api/moderation/queue",
      "POST /api/moderation/:id",
      "GET  /api/moderation/log",
      "GET  /api/debate/votes",
      "POST /api/debate/vote",
    ]
  });
});

// ============================================================
// UTILITIES
// ============================================================

// Mock toxicity scorer — replace with Perspective API in production
function simulateToxicityScore(text) {
  const toxicPatterns = [
    /personne ne/i, /honte/i, /gaspill/i, /nul/i,
    /nobody/i, /waste/i, /disgrace/i, /useless/i
  ];
  const matches = toxicPatterns.filter((p) => p.test(text)).length;
  return Math.min(0.1 + (matches * 0.25) + Math.random() * 0.05, 1);
}

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(`\n🚀 Espace API running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 Comments:     http://localhost:${PORT}/api/comments?articleId=art-001`);
  console.log(`🛡  Moderation:   http://localhost:${PORT}/api/moderation/queue\n`);
});

module.exports = app;
