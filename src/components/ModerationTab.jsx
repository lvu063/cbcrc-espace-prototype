// ============================================================
// ModerationTab — AI-Assisted Moderation Dashboard
// Author: Lê (Hai-Huong Le Vu)
// ============================================================
// Demonstrates modern moderation tooling concepts:
// - Toxicity scoring (simulating Perspective API integration)
// - AI-generated content labels and suggestions
// - Animated card removal on moderator action
// - Live counter updating as decisions are made
// - False positive handling (approve flagged quality content)
//
// In production this would integrate with:
// - Google Perspective API for toxicity scoring
// - A human review queue in Firebase Realtime Database
// - Webhook notifications to content editors
// ============================================================

import { useState } from "react";
import { flaggedComments } from "../data/mockData";

function ToxicityBar({ score }) {
  const color = score > 0.5 ? "#CC0000" : score > 0.2 ? "#E8A020" : "#2ECC71";
  const label = score > 0.5 ? "Élevé / High" : score > 0.2 ? "Moyen / Medium" : "Faible / Low";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between",
                    fontSize: "0.75rem", marginBottom: "3px" }}>
        <span style={{ color: "#888" }}>
          {score > 0.5 ? "🔴" : score > 0.2 ? "🟡" : "🟢"} {label}
        </span>
        <span style={{ color, fontWeight: 700 }}>
          {Math.round(score * 100)}%
        </span>
      </div>
      <div style={{ background: "#F0EDE8", borderRadius: "4px", height: "5px" }}>
        <div style={{
          background: color, width: `${score * 100}%`,
          height: "100%", borderRadius: "4px",
          transition: "width 0.4s ease"
        }} />
      </div>
    </div>
  );
}

export default function ModerationTab({ lang, t }) {
  const [queue, setQueue]       = useState(flaggedComments);
  const [processed, setProcessed] = useState(0);
  const [leaving, setLeaving]   = useState(null);

  const handleAction = (id, action) => {
    setLeaving(id);
    setTimeout(() => {
      setQueue((prev) => prev.filter((c) => c.id !== id));
      setProcessed((prev) => prev + 1);
      setLeaving(null);
    }, 350);
  };

  const stats = [
    {
      label: { fr: "Commentaires analysés", en: "Comments analysed" },
      value: "1,247"
    },
    {
      label: { fr: "Taux de toxicité", en: "Toxicity rate" },
      value: "3.2%"
    },
    {
      label: { fr: "Temps moyen", en: "Avg. review time" },
      value: "4 min"
    },
    {
      label: { fr: "Traités aujourd'hui", en: "Processed today" },
      value: processed + 14
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700,
                     color: "#1B1E2B", marginBottom: "0.35rem" }}>
          {lang === "fr" ? "Tableau de modération" : "Moderation dashboard"}
        </h2>
        <p style={{ fontSize: "0.85rem", color: "#888", margin: 0 }}>
          {lang === "fr"
            ? "Assisté par IA — les scores de toxicité sont générés automatiquement."
            : "AI-assisted — toxicity scores are generated automatically."}
        </p>
      </div>

      {/* Stats bar */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: "0.75rem", marginBottom: "1.5rem"
      }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            background: "white", borderRadius: "10px",
            padding: "0.85rem", border: "1px solid #E8E4DC",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.3rem", fontWeight: 700,
                          color: "#CC0000" }}>
              {stat.value}
            </div>
            <div style={{ fontSize: "0.72rem", color: "#888",
                          marginTop: "2px" }}>
              {t(stat.label)}
            </div>
          </div>
        ))}
      </div>

      {/* Queue */}
      {queue.length === 0 ? (
        <div style={{
          background: "white", borderRadius: "12px",
          padding: "3rem", textAlign: "center",
          border: "1px solid #E8E4DC"
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✅</div>
          <p style={{ color: "#888", fontSize: "0.95rem" }}>
            {lang === "fr"
              ? "File d'attente vide — excellent travail !"
              : "Queue is empty — great work!"}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {queue.map((comment) => (
            <div
              key={comment.id}
              style={{
                background: "white", borderRadius: "12px",
                padding: "1.25rem", border: "1px solid #E8E4DC",
                opacity: leaving === comment.id ? 0 : 1,
                transform: leaving === comment.id
                  ? "translateX(30px)" : "translateX(0)",
                transition: "opacity 0.3s ease, transform 0.3s ease"
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between",
                            alignItems: "flex-start", marginBottom: "0.75rem",
                            flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: "0.88rem",
                                  color: "#1B1E2B" }}>
                    {comment.author}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#aaa",
                                  marginLeft: "0.5rem" }}>
                    {comment.flags} {lang === "fr"
                      ? `signalement${comment.flags > 1 ? "s" : ""}`
                      : `flag${comment.flags > 1 ? "s" : ""}`}
                  </span>
                </div>
                <span style={{
                  background: comment.toxicityScore > 0.5 ? "#FFE5E5"
                    : comment.toxicityScore > 0.2 ? "#FFF8E5" : "#E5F9F0",
                  color: comment.toxicityScore > 0.5 ? "#CC0000"
                    : comment.toxicityScore > 0.2 ? "#996600" : "#007A40",
                  fontSize: "0.72rem", fontWeight: 600,
                  padding: "3px 8px", borderRadius: "8px"
                }}>
                  {t(comment.aiLabel)}
                </span>
              </div>

              {/* Comment text */}
              <p style={{ margin: "0 0 0.75rem", fontSize: "0.9rem",
                           color: "#333", lineHeight: 1.6,
                           borderLeft: "3px solid #E8E4DC",
                           paddingLeft: "0.75rem" }}>
                {t(comment.content)}
              </p>

              {/* Toxicity bar */}
              <div style={{ marginBottom: "0.75rem" }}>
                <ToxicityBar score={comment.toxicityScore} />
              </div>

              {/* AI suggestion */}
              <p style={{
                background: "#F8F6F2", borderRadius: "8px",
                padding: "0.6rem 0.85rem", fontSize: "0.8rem",
                color: "#666", margin: "0 0 0.85rem",
                fontStyle: "italic"
              }}>
                🤖 {t(comment.aiSuggestion)}
              </p>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => handleAction(comment.id, "approve")}
                  style={{
                    background: "#2ECC71", color: "white", border: "none",
                    padding: "0.45rem 1rem", borderRadius: "16px",
                    cursor: "pointer", fontWeight: 600, fontSize: "0.82rem"
                  }}
                >
                  ✓ {lang === "fr" ? "Approuver" : "Approve"}
                </button>
                <button
                  onClick={() => handleAction(comment.id, "remove")}
                  style={{
                    background: "#CC0000", color: "white", border: "none",
                    padding: "0.45rem 1rem", borderRadius: "16px",
                    cursor: "pointer", fontWeight: 600, fontSize: "0.82rem"
                  }}
                >
                  ✗ {lang === "fr" ? "Retirer" : "Remove"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
