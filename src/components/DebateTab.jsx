// ============================================================
// DebateTab — Opinion Mapping (Pol.is inspired)
// Author: Lê (Hai-Huong Le Vu)
// ============================================================
// Demonstrates structured debate as an alternative to
// unmoderated comment threads. Key concepts:
// - Opinion clustering instead of binary up/down voting
// - Consensus surfacing across ideological groups
// - SVG-based visualisation built without external chart libraries
// - Animated cluster reveal on first interaction
// ============================================================

import { useState, useEffect } from "react";
import { debateStatement, debateClusters, consensusInsight } from "../data/mockData";

export default function DebateTab({ lang, t }) {
  const [voted, setVoted]         = useState(false);
  const [vote, setVote]           = useState(null);
  const [animated, setAnimated]   = useState(false);
  const [counts, setCounts]       = useState({ agree: 4821, disagree: 1523, nuanced: 867 });

  useEffect(() => {
    if (voted) {
      const timer = setTimeout(() => setAnimated(true), 300);
      return () => clearTimeout(timer);
    }
  }, [voted]);

  const handleVote = (choice) => {
    setVote(choice);
    setVoted(true);
    setCounts((prev) => ({ ...prev, [choice]: prev[choice] + 1 }));
  };

  const total = counts.agree + counts.disagree + counts.nuanced;

  const voteButtons = [
    {
      id: "agree",
      label: { fr: "D'accord", en: "Agree" },
      color: "#CC0000",
      emoji: "✓"
    },
    {
      id: "disagree",
      label: { fr: "Pas d'accord", en: "Disagree" },
      color: "#1B1E2B",
      emoji: "✗"
    },
    {
      id: "nuanced",
      label: { fr: "C'est complexe", en: "It's complex" },
      color: "#E8A020",
      emoji: "◐"
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700,
                     color: "#1B1E2B", marginBottom: "0.35rem" }}>
          {lang === "fr" ? "Cartographie du débat" : "Debate mapping"}
        </h2>
        <p style={{ fontSize: "0.85rem", color: "#888", margin: 0 }}>
          {lang === "fr"
            ? "Au lieu de commenter, positionnez-vous. Découvrez où se trouve le consensus."
            : "Instead of commenting, take a position. Discover where consensus lies."}
        </p>
      </div>

      {/* Statement card */}
      <div style={{
        background: "white", borderRadius: "12px",
        padding: "1.5rem", marginBottom: "1.25rem",
        border: "1px solid #E8E4DC"
      }}>
        <p style={{
          fontSize: "1.05rem", fontWeight: 600,
          color: "#1B1E2B", lineHeight: 1.5,
          margin: "0 0 1.25rem", fontStyle: "italic"
        }}>
          "{t(debateStatement)}"
        </p>

        {!voted ? (
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {voteButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleVote(btn.id)}
                style={{
                  background: btn.color, color: "white",
                  border: "none", padding: "0.6rem 1.4rem",
                  borderRadius: "24px", cursor: "pointer",
                  fontWeight: 600, fontSize: "0.9rem",
                  transition: "opacity 0.2s",
                  display: "flex", alignItems: "center", gap: "6px"
                }}
              >
                <span>{btn.emoji}</span>
                {t(btn.label)}
              </button>
            ))}
          </div>
        ) : (
          <div style={{
            background: "#F8F6F2", borderRadius: "8px",
            padding: "0.75rem 1rem", fontSize: "0.88rem", color: "#555"
          }}>
            {lang === "fr"
              ? `Vous avez répondu : "${t(voteButtons.find(b => b.id === vote)?.label)}" — merci pour votre participation.`
              : `You responded: "${t(voteButtons.find(b => b.id === vote)?.label)}" — thank you for participating.`}
          </div>
        )}
      </div>

      {/* Opinion map — always visible, clusters reveal after voting */}
      <div style={{
        background: "white", borderRadius: "12px",
        padding: "1.5rem", marginBottom: "1.25rem",
        border: "1px solid #E8E4DC"
      }}>
        <h3 style={{ margin: "0 0 1rem", fontSize: "0.95rem",
                     fontWeight: 600, color: "#1B1E2B" }}>
          {lang === "fr" ? "Carte des opinions" : "Opinion map"}
        </h3>

        {/* SVG cluster visualisation */}
        <svg viewBox="0 0 400 220" style={{ width: "100%", maxHeight: "200px" }}>
          {/* Grid lines */}
          {[60, 120, 180].map((y) => (
            <line key={y} x1="20" y1={y} x2="380" y2={y}
                  stroke="#F0EDE8" strokeWidth="1" />
          ))}
          {[100, 200, 300].map((x) => (
            <line key={x} x1={x} y1="10" x2={x} y2="210"
                  stroke="#F0EDE8" strokeWidth="1" />
          ))}

          {/* Axis labels */}
          <text x="20"  y="215" fontSize="9" fill="#bbb">
            {lang === "fr" ? "← Opposition" : "← Opposition"}
          </text>
          <text x="280" y="215" fontSize="9" fill="#bbb">
            {lang === "fr" ? "Soutien →" : "Support →"}
          </text>

          {/* Clusters */}
          {debateClusters.map((cluster, i) => {
            const cx = (cluster.x / 100) * 360 + 20;
            const cy = (cluster.y / 100) * 200 + 10;
            const r  = voted && animated
              ? Math.sqrt(cluster.size) * 4.5
              : 8;
            return (
              <g key={cluster.id}>
                <circle
                  cx={cx} cy={cy} r={r}
                  fill={cluster.color}
                  opacity={voted ? (animated ? 0.75 : 0.2) : 0.15}
                  style={{ transition: "r 0.6s ease, opacity 0.6s ease" }}
                />
                {voted && animated && (
                  <>
                    <text x={cx} y={cy - r - 6}
                          textAnchor="middle" fontSize="9"
                          fill={cluster.color} fontWeight="600">
                      {t(cluster.label)}
                    </text>
                    <text x={cx} y={cy + 4}
                          textAnchor="middle" fontSize="9"
                          fill="white" fontWeight="700">
                      {cluster.size}%
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {/* Your vote marker */}
          {voted && (
            <circle cx={200} cy={110} r={6}
                    fill="#FFD700" stroke="white" strokeWidth="2"
                    style={{ transition: "opacity 0.5s" }} />
          )}
        </svg>

        {!voted && (
          <p style={{ textAlign: "center", fontSize: "0.82rem",
                      color: "#aaa", marginTop: "0.5rem" }}>
            {lang === "fr"
              ? "Répondez ci-dessus pour révéler la carte des opinions"
              : "Answer above to reveal the opinion map"}
          </p>
        )}

        {/* Vote breakdown bars */}
        {voted && (
          <div style={{ marginTop: "1rem" }}>
            {voteButtons.map((btn) => (
              <div key={btn.id} style={{ marginBottom: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between",
                              fontSize: "0.8rem", marginBottom: "3px" }}>
                  <span style={{ color: btn.color, fontWeight: 600 }}>
                    {t(btn.label)}
                  </span>
                  <span style={{ color: "#888" }}>
                    {counts[btn.id].toLocaleString()}
                    ({Math.round(counts[btn.id] / total * 100)}%)
                  </span>
                </div>
                <div style={{ background: "#F0EDE8", borderRadius: "4px", height: "6px" }}>
                  <div style={{
                    background: btn.color,
                    width: `${Math.round(counts[btn.id] / total * 100)}%`,
                    height: "100%", borderRadius: "4px",
                    transition: "width 0.6s ease"
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Consensus insight */}
      {voted && animated && (
        <div style={{
          background: "#FFF5F5", border: "1px solid #FFD5D5",
          borderRadius: "10px", padding: "1rem 1.25rem",
          fontSize: "0.9rem", color: "#7A0000", lineHeight: 1.6
        }}>
          💡 {t(consensusInsight)}
        </div>
      )}
    </div>
  );
}
