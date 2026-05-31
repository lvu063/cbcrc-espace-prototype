// ============================================================
// ImpactTab — Community Analytics Dashboard
// Author: Lê (Hai-Huong Le Vu)
// ============================================================
// Demonstrates the "impact visibility" solution to low engagement:
// showing users and stakeholders the real reach of community
// participation. Key techniques:
// - Animated count-up on mount (useEffect + requestAnimationFrame)
// - SVG horizontal bar chart built without a chart library
// - Recognition wall to reward top contributors
// ============================================================

import { useState, useEffect, useRef } from "react";
import { impactStats, languageBreakdown, recognitionWall } from "../data/mockData";

// Animated counter hook
function useCountUp(target, duration = 1800) {
  const [value, setValue]   = useState(0);
  const frameRef            = useRef(null);

  useEffect(() => {
    const start     = performance.now();
    const animate   = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return value;
}

function StatCard({ value, label, suffix = "", color = "#CC0000" }) {
  const animated = useCountUp(typeof value === "number" ? value : 0, 1600);
  return (
    <div style={{
      background: "white", borderRadius: "12px",
      padding: "1.25rem", border: "1px solid #E8E4DC",
      textAlign: "center"
    }}>
      <div style={{ fontSize: "2rem", fontWeight: 800,
                    color, lineHeight: 1 }}>
        {typeof value === "number"
          ? animated.toLocaleString() + suffix
          : value}
      </div>
      <div style={{ fontSize: "0.78rem", color: "#888",
                    marginTop: "6px", lineHeight: 1.4 }}>
        {label}
      </div>
    </div>
  );
}

export default function ImpactTab({ lang, t }) {
  const stats = [
    {
      value: impactStats.voicesHeard,
      label: lang === "fr" ? "Voix entendues" : "Voices heard",
      color: "#CC0000"
    },
    {
      value: impactStats.languages,
      label: lang === "fr" ? "Langues représentées" : "Languages represented",
      color: "#1B1E2B"
    },
    {
      value: impactStats.constructiveComments,
      suffix: "%",
      label: lang === "fr" ? "Commentaires constructifs" : "Constructive comments",
      color: "#2ECC71"
    },
    {
      value: impactStats.activeCommunities,
      label: lang === "fr" ? "Communautés actives" : "Active communities",
      color: "#E8A020"
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700,
                     color: "#1B1E2B", marginBottom: "0.35rem" }}>
          {lang === "fr" ? "Impact communautaire" : "Community impact"}
        </h2>
        <p style={{ fontSize: "0.85rem", color: "#888", margin: 0 }}>
          {lang === "fr"
            ? "Parce que participer devrait se sentir comme un acte qui compte."
            : "Because participating should feel like an act that matters."}
        </p>
      </div>

      {/* Animated stat cards */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
        gap: "0.85rem", marginBottom: "1.75rem"
      }}>
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Language breakdown */}
      <div style={{
        background: "white", borderRadius: "12px",
        padding: "1.25rem", marginBottom: "1.5rem",
        border: "1px solid #E8E4DC"
      }}>
        <h3 style={{ margin: "0 0 1rem", fontSize: "0.95rem",
                     fontWeight: 600, color: "#1B1E2B" }}>
          {lang === "fr"
            ? "Engagement par langue"
            : "Engagement by language"}
        </h3>
        <svg viewBox="0 0 360 90" style={{ width: "100%" }}>
          {languageBreakdown.map((item, i) => {
            const y       = i * 28 + 8;
            const barW    = (item.percentage / 100) * 220;
            return (
              <g key={item.language}>
                <text x="0" y={y + 13}
                      fontSize="11" fill="#555" fontWeight="500">
                  {item.language}
                </text>
                <rect x="90" y={y} width={barW} height="18"
                      rx="4" fill={item.color} opacity="0.85" />
                <text x={90 + barW + 6} y={y + 13}
                      fontSize="11" fill={item.color} fontWeight="700">
                  {item.percentage}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Recognition wall */}
      <div style={{
        background: "white", borderRadius: "12px",
        padding: "1.25rem", border: "1px solid #E8E4DC"
      }}>
        <h3 style={{ margin: "0 0 1rem", fontSize: "0.95rem",
                     fontWeight: 600, color: "#1B1E2B" }}>
          {lang === "fr"
            ? "Mur de reconnaissance"
            : "Wall of recognition"}
        </h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "0.75rem"
        }}>
          {recognitionWall.map((user) => (
            <div key={user.id} style={{
              background: user.highlight ? "#FFF5F5" : "#F8F6F2",
              border: user.highlight
                ? "1.5px solid #CC0000" : "1px solid #E8E4DC",
              borderRadius: "10px", padding: "1rem",
              position: "relative"
            }}>
              {user.highlight && (
                <div style={{
                  position: "absolute", top: "-10px", right: "10px",
                  background: "#CC0000", color: "white",
                  fontSize: "0.65rem", fontWeight: 700,
                  padding: "2px 8px", borderRadius: "8px"
                }}>
                  🏆 {lang === "fr" ? "Cette semaine" : "This week"}
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center",
                            gap: "0.5rem", marginBottom: "0.5rem" }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "#CC0000", color: "white",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "0.7rem",
                  fontWeight: 700, flexShrink: 0
                }}>
                  {user.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.82rem",
                                color: "#1B1E2B" }}>
                    {user.username}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "#aaa" }}>
                    {user.comments} {lang === "fr" ? "contributions" : "contributions"}
                  </div>
                </div>
              </div>
              <p style={{
                margin: 0, fontSize: "0.8rem", color: "#555",
                fontStyle: "italic", lineHeight: 1.5
              }}>
                "{t(user.quote)}"
              </p>
              <div style={{
                marginTop: "0.5rem", fontSize: "0.68rem",
                color: user.highlight ? "#CC0000" : "#888",
                fontWeight: user.highlight ? 700 : 400
              }}>
                {t(user.level)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
