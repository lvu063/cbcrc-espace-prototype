// ============================================================
// HomeTab — Bilingual Comment Feed
// Author: Lê (Hai-Huong Le Vu)
// ============================================================
// Core community interaction component demonstrating:
// - Controlled form input with character counter
// - Optimistic UI update (comment appears instantly)
// - Positivity nudge before publishing
// - Encouragement toast on submission
// - Upvote interaction with local state
// - Franglais detection for bilingual encouragement
// ============================================================

import { useState } from "react";
import { initialComments, articles } from "../data/mockData";

const FRENCH_WORDS = ["je", "tu", "nous", "vous", "les", "des", "est", "une", "avec",
                       "merci", "bonjour", "oui", "non", "aussi", "mais", "pour", "dans"];

function detectsFrench(text) {
  const words = text.toLowerCase().split(/\s+/);
  return words.some((w) => FRENCH_WORDS.includes(w));
}

function Avatar({ initials, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "#CC0000", color: "white",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 700, flexShrink: 0
    }}>
      {initials}
    </div>
  );
}

function ReputationBadge({ level, lang }) {
  const colors = { expert: "#1B1E2B", regular: "#CC0000", new: "#E8A020" };
  const labels = {
    expert:  { fr: "Expert",        en: "Expert"      },
    regular: { fr: "Régulier",      en: "Regular"     },
    new:     { fr: "Nouveau",       en: "New"         },
  };
  return (
    <span style={{
      background: colors[level] || "#999",
      color: "white", fontSize: "0.65rem", fontWeight: 600,
      padding: "2px 7px", borderRadius: "10px", letterSpacing: "0.04em"
    }}>
      {labels[level]?.[lang] ?? level}
    </span>
  );
}

export default function HomeTab({ lang, t }) {
  const article = articles[0];
  const [comments, setComments]   = useState(initialComments);
  const [draft, setDraft]         = useState("");
  const [showNudge, setShowNudge] = useState(false);
  const [toast, setToast]         = useState(null);

  const handleSubmitClick = () => {
    if (draft.trim().length < 3) return;
    setShowNudge(true);
  };

  const handleConfirmPost = () => {
    const hasFrench = detectsFrench(draft);
    const newComment = {
      id: `cmt-new-${Date.now()}`,
      articleId: article.id,
      author: lang === "fr" ? "Vous" : "You",
      avatar: "V",
      content: { fr: draft, en: draft },
      language: hasFrench ? "fr" : "en",
      timestamp: new Date().toISOString(),
      upvotes: 0,
      seenBy: 1,
      reputation: { fr: "Nouveau membre", en: "New Member" },
      reputationLevel: "new",
      approved: true,
      toxicityScore: 0.01,
    };
    setComments((prev) => [newComment, ...prev]);
    setDraft("");
    setShowNudge(false);
    const msg = hasFrench
      ? { fr: "Merci de contribuer en français 🌟 Votre voix compte.",
          en: "Merci de contribuer 🌟 Your voice matters." }
      : { fr: "Merci pour votre contribution ! 🌟",
          en: "Thanks for contributing! 🌟 Your voice matters." };
    setToast(t(msg));
    setTimeout(() => setToast(null), 3500);
  };

  const handleUpvote = (id) => {
    setComments((prev) =>
      prev.map((c) => c.id === id ? { ...c, upvotes: c.upvotes + 1 } : c)
    );
  };

  const timeAgo = (iso) => {
    const diff = Math.floor((Date.now() - new Date(iso)) / 60000);
    if (diff < 1)  return lang === "fr" ? "À l'instant"    : "Just now";
    if (diff < 60) return lang === "fr" ? `${diff} min`    : `${diff}m ago`;
    const h = Math.floor(diff / 60);
    return lang === "fr" ? `${h}h` : `${h}h ago`;
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: "1.5rem", right: "1.5rem",
          background: "#1B1E2B", color: "white",
          padding: "0.85rem 1.25rem", borderRadius: "10px",
          fontSize: "0.9rem", fontWeight: 500, zIndex: 999,
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          animation: "fadeIn 0.3s ease"
        }}>
          {toast}
        </div>
      )}

      {/* Article card */}
      <div style={{
        background: "white", borderRadius: "12px",
        padding: "1.5rem", marginBottom: "1.5rem",
        border: "1px solid #E8E4DC"
      }}>
        <span style={{
          background: "#CC0000", color: "white",
          fontSize: "0.7rem", fontWeight: 600,
          padding: "3px 8px", borderRadius: "4px",
          letterSpacing: "0.06em", textTransform: "uppercase"
        }}>
          {t(article.category)}
        </span>
        <h2 style={{ margin: "0.75rem 0 0.5rem", fontSize: "1.15rem",
                     fontWeight: 700, color: "#1B1E2B", lineHeight: 1.35 }}>
          {t(article.headline)}
        </h2>
        <p style={{ margin: "0 0 0.75rem", color: "#555",
                    fontSize: "0.92rem", lineHeight: 1.65 }}>
          {t(article.summary)}
        </p>
        <span style={{ fontSize: "0.78rem", color: "#999" }}>
          {lang === "fr"
            ? `${article.readCount.toLocaleString()} lectures`
            : `${article.readCount.toLocaleString()} reads`}
        </span>
      </div>

      {/* Comment input */}
      <div style={{
        background: "white", borderRadius: "12px",
        padding: "1.25rem", marginBottom: "1.5rem",
        border: "1px solid #E8E4DC"
      }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, 280))}
          placeholder={lang === "fr"
            ? "Partagez votre perspective — le franglais est le bienvenu ici 🌟"
            : "Share your perspective — franglais welcome here 🌟"}
          style={{
            width: "100%", minHeight: "90px",
            border: "1px solid #E8E4DC", borderRadius: "8px",
            padding: "0.75rem", fontSize: "0.9rem",
            fontFamily: "Inter, sans-serif", resize: "vertical",
            outline: "none", boxSizing: "border-box",
            color: "#1B1E2B"
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between",
                      alignItems: "center", marginTop: "0.5rem" }}>
          <span style={{ fontSize: "0.75rem", color: draft.length > 250 ? "#CC0000" : "#aaa" }}>
            {draft.length}/280
          </span>
          <button
            onClick={handleSubmitClick}
            disabled={draft.trim().length < 3}
            style={{
              background: draft.trim().length < 3 ? "#ccc" : "#CC0000",
              color: "white", border: "none",
              padding: "0.5rem 1.25rem", borderRadius: "20px",
              cursor: draft.trim().length < 3 ? "not-allowed" : "pointer",
              fontWeight: 600, fontSize: "0.875rem",
              transition: "background 0.2s"
            }}
          >
            {lang === "fr" ? "Publier" : "Post"}
          </button>
        </div>

        {/* Positivity nudge */}
        {showNudge && (
          <div style={{
            background: "#FFFBEA", border: "1px solid #F5D76E",
            borderRadius: "10px", padding: "1rem", marginTop: "0.75rem"
          }}>
            <p style={{ margin: "0 0 0.75rem", fontSize: "0.88rem",
                        color: "#7A6000", fontWeight: 500 }}>
              {lang === "fr"
                ? "✨ Avant de publier : est-ce que votre commentaire contribue à la conversation ?"
                : "✨ Before posting: does your comment add to the conversation?"}
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={handleConfirmPost} style={{
                background: "#CC0000", color: "white", border: "none",
                padding: "0.4rem 1rem", borderRadius: "16px",
                cursor: "pointer", fontWeight: 600, fontSize: "0.82rem"
              }}>
                {lang === "fr" ? "Oui, publier" : "Yes, post"}
              </button>
              <button onClick={() => setShowNudge(false)} style={{
                background: "none", color: "#7A6000",
                border: "1px solid #F5D76E",
                padding: "0.4rem 1rem", borderRadius: "16px",
                cursor: "pointer", fontSize: "0.82rem"
              }}>
                {lang === "fr" ? "Réviser" : "Revise"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Community guidelines */}
      <div style={{
        background: "#FFF5F5", border: "1px solid #FFD5D5",
        borderRadius: "10px", padding: "0.85rem 1.1rem",
        marginBottom: "1.5rem", fontSize: "0.82rem", color: "#7A0000"
      }}>
        🌿 {lang === "fr"
          ? "Le français sous toutes ses formes est le bienvenu — du québécois au franglais. Soyons bienveillants."
          : "French in all its forms is welcome — from Québécois to franglais. Let's be kind."}
      </div>

      {/* Comment feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {comments.map((comment) => (
          <div key={comment.id} style={{
            background: "white", borderRadius: "12px",
            padding: "1.1rem", border: "1px solid #E8E4DC"
          }}>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <Avatar initials={comment.avatar} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center",
                              gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.88rem",
                                  color: "#1B1E2B" }}>
                    {comment.author}
                  </span>
                  <ReputationBadge level={comment.reputationLevel} lang={lang} />
                  <span style={{ fontSize: "0.75rem", color: "#aaa" }}>
                    {timeAgo(comment.timestamp)}
                  </span>
                </div>
                <p style={{ margin: "0 0 0.65rem", fontSize: "0.9rem",
                             color: "#333", lineHeight: 1.65 }}>
                  {t(comment.content)}
                </p>
                <div style={{ display: "flex", gap: "1rem",
                              alignItems: "center", fontSize: "0.78rem", color: "#aaa" }}>
                  <button
                    onClick={() => handleUpvote(comment.id)}
                    style={{
                      background: "none", border: "1px solid #E8E4DC",
                      borderRadius: "12px", padding: "3px 10px",
                      cursor: "pointer", fontSize: "0.78rem", color: "#666",
                      display: "flex", alignItems: "center", gap: "4px"
                    }}
                  >
                    👍 {lang === "fr" ? "Utile" : "Helpful"} · {comment.upvotes}
                  </button>
                  <span>
                    {lang === "fr"
                      ? `Vu par ${comment.seenBy.toLocaleString()} personnes`
                      : `Seen by ${comment.seenBy.toLocaleString()} people`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
