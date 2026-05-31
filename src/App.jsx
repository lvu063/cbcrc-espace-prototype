// ============================================================
// Espace — Main App Component
// Author: Lê (Hai-Huong Le Vu)
// ============================================================
// Root component that orchestrates the four-tab interface:
// 1. Accueil / Home     — bilingual comment feed
// 2. Débat / Debate     — Pol.is-inspired opinion mapping
// 3. Modération         — AI-assisted moderation dashboard
// 4. Impact             — community analytics dashboard
//
// Tech stack: React, custom hooks, SVG-based visualisations
// No external UI library — built from scratch to demonstrate
// component architecture and state management understanding.
// ============================================================

import { useState } from "react";
import { useLanguage } from "./hooks/useLanguage";
import HomeTab from "./components/HomeTab";
import DebateTab from "./components/DebateTab";
import ModerationTab from "./components/ModerationTab";
import ImpactTab from "./components/ImpactTab";

const TABS = [
  { id: "home",       label: { fr: "Accueil",      en: "Home"       } },
  { id: "debate",     label: { fr: "Débat",         en: "Debate"     } },
  { id: "moderation", label: { fr: "Modération",    en: "Moderation" } },
  { id: "impact",     label: { fr: "Impact",        en: "Impact"     } },
];

export default function App() {
  const { lang, toggleLanguage, t } = useLanguage("fr");
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#F8F6F2", minHeight: "100vh" }}>

      {/* ── Header ── */}
      <header style={{
        background: "#CC0000",
        color: "white",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Espace
          </h1>
          <p style={{ margin: 0, fontSize: "0.78rem", opacity: 0.85, marginTop: "2px" }}>
            {lang === "fr"
              ? "Un espace pour toutes les voix"
              : "A space for every voice"}
          </p>
        </div>
        {/* Language toggle */}
        <button
          onClick={toggleLanguage}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.4)",
            color: "white",
            padding: "0.4rem 1rem",
            borderRadius: "20px",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
            transition: "background 0.2s"
          }}
        >
          {lang === "fr" ? "EN" : "FR"}
        </button>
      </header>

      {/* ── Tab navigation ── */}
      <nav style={{
        background: "white",
        display: "flex",
        borderBottom: "1px solid #E8E4DC",
        padding: "0 2rem"
      }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #CC0000" : "2px solid transparent",
              color: activeTab === tab.id ? "#CC0000" : "#666",
              fontWeight: activeTab === tab.id ? 600 : 400,
              padding: "1rem 1.25rem",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "color 0.15s",
              marginBottom: "-1px"
            }}
          >
            {t(tab.label)}
          </button>
        ))}
      </nav>

      {/* ── Tab content ── */}
      <main style={{ maxWidth: "860px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {activeTab === "home"       && <HomeTab       lang={lang} t={t} />}
        {activeTab === "debate"     && <DebateTab     lang={lang} t={t} />}
        {activeTab === "moderation" && <ModerationTab lang={lang} t={t} />}
        {activeTab === "impact"     && <ImpactTab     lang={lang} t={t} />}
      </main>

      {/* ── Footer ── */}
      <footer style={{
        textAlign: "center",
        padding: "2rem",
        color: "#999",
        fontSize: "0.78rem",
        borderTop: "1px solid #E8E4DC"
      }}>
        {lang === "fr"
          ? "Espace — Prototype conceptuel pour CBC Radio-Canada · Le français sous toutes ses formes est le bienvenu"
          : "Espace — Concept prototype for CBC Radio-Canada · French in all its forms is welcome"}
      </footer>
    </div>
  );
}
