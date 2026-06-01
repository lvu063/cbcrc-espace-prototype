# Bilingual Community Engagement Platform — Concept Prototype
*A full-stack React prototype addressing the core failures of online comment sections, built as a demonstration of product thinking and frontend development for CBC Radio-Canada's Conversations and Community team.*

---

## Live Demo

**[View live prototype →](https://espace-cbc-rc.lovable.app)**

---

## The Problem

Online comment sections consistently fail due to five compounding issues:

1. **Toxicity & harassment** — anonymity breeds hostility, driving away constructive voices
2. **Echo chambers** — algorithmic sorting polarises rather than connects
3. **No incentive to participate** — users don't see the impact of their contribution
4. **Moderation bottlenecks** — manual review is reactive and expensive
5. **Linguistic insecurity** — francophone users self-censor for fear of judgment

CBC Radio-Canada's YouTube comments are turned off. Bill C-18 has reduced news reach on social platforms. The public broadcaster needs a better community infrastructure — built for Canadian linguistic reality.

## The Solution — Espace

Espace is a bilingual (FR/EN) community platform prototype that directly addresses each failure with a modern, research-backed solution:

| Problem | Espace Solution |
|---|---|
| Toxicity | AI-assisted moderation with Perspective API-style scoring |
| Echo chambers | Pol.is-inspired opinion mapping — clusters consensus, not controversy |
| No incentive | Impact counters, recognition wall, seen-by counts |
| Moderation bottlenecks | Automated AI triage with human review queue |
| Linguistic insecurity | Franglais-positive design, encouragement on French contribution |

---

## Features

### 🏠 Accueil / Home — Bilingual Comment Feed
- Language toggle (FR/EN) that switches the entire interface
- Franglais-positive comment input with positivity nudge before posting
- Encouragement toast when French is detected in a comment
- Upvote interaction with optimistic UI update
- Reputation badges (Expert, Regular, New)
- Impact counter per comment ("Vu par X personnes")

### 🗳 Débat / Debate — Opinion Mapping
- Pol.is-inspired structured debate interface
- Three-position voting (Agree / Disagree / Complex)
- SVG-based animated cluster visualisation that reveals after voting
- Consensus insight surfaced from majority position
- Live vote count with percentage breakdown

### 🛡 Modération / Moderation — AI-Assisted Dashboard
- Toxicity score bar per flagged comment (simulating Perspective API)
- AI-generated content labels (Aggressive tone / Off-topic / Quality content)
- Animated card removal on moderator action
- False positive handling — quality content flagged in error is surfaced
- Live stats: comments analysed, toxicity rate, avg review time

### 📊 Impact — Community Analytics
- Animated count-up counters on mount (requestAnimationFrame)
- SVG horizontal bar chart — language breakdown (FR / EN / Franglais)
- Recognition wall — top contributors with weekly highlight
- No external chart library — built from scratch

---

## Tech Stack

| Technology | Usage |
|---|---|
| React 18 | Component architecture, hooks, state management |
| Custom hooks | `useLanguage` — bilingual state management across the app |
| SVG | Data visualisations built without external chart libraries |
| CSS-in-JS (inline) | Component-scoped styling |
| Mock data layer | `mockData.js` — structured for easy API replacement |

---

## Project Structure

```
cbcrc-espace-prototype/
├── server.js                      # Express.js REST API — 10 endpoints
├── server.test.js                 # Integration tests — 21 tests, all passing
├── package.json                   # Dependencies + npm scripts
├── CHANGELOG.md                   # Versioned development history
├── CONTRIBUTING.md                # Git workflow, Agile process, bilingual guidelines
├── README.md                      # Problem/solution mapping, production roadmap
├── .github/
│   ├── pull_request_template.md   # Bilingual PR checklist
│   └── ISSUE_TEMPLATE/
│       ├── feature.md             # Feature request template (FR/EN)
│       └── bug.md                 # Bug report template
└── src/
    ├── App.jsx                    # Root component — tab navigation, language toggle
    ├── types.ts                   # TypeScript interfaces — shared frontend/backend types
    ├── hooks/
    │   ├── useLanguage.js         # Custom hook — bilingual state management
    │   └── useLanguage.test.js    # Unit tests — 11 tests covering toggle, t(), stability
    ├── components/
    │   ├── HomeTab.jsx            # Comment feed with positivity nudge + franglais detection
    │   ├── DebateTab.jsx          # Opinion mapping with SVG cluster visualisation
    │   ├── ModerationTab.jsx      # AI-assisted moderation dashboard + toxicity scoring
    │   └── ImpactTab.jsx          # Analytics with animated count-up counters
    └── data/
        ├── mockData.js            # Structured bilingual mock data — ES module (frontend)
        └── mockData.cjs           # CommonJS version — consumed by Express server
```

## Design Decisions

**Why no external UI library?**
Building components from scratch demonstrates understanding of React's component model and state management — not just the ability to use pre-built tools.

**Why SVG for charts?**
SVG visualisations without Chart.js or Recharts show direct understanding of browser rendering and coordinate systems — closer to what a production engineering team would want to maintain.

**Why a custom language hook?**
`useLanguage` centralises bilingual state and provides a `t()` helper that resolves `{ fr: "...", en: "..." }` objects throughout the component tree. In production this would wrap i18next — the hook structure makes that migration trivial.

**Why mock data in a separate file?**
`mockData.js` uses the same schema a real API would return. Replacing mock data with live Firebase or PostgreSQL calls requires only changing the import source — not restructuring the components.

---

## Production Roadmap

If this were a real feature at CBC Radio-Canada:

```
Phase 1 — Core infrastructure
  ├── Firebase Realtime Database for live comment streaming
  ├── Perspective API integration for toxicity scoring
  ├── PostgreSQL for persistent user reputation data
  └── Node.js / Express.js API layer

Phase 2 — Bilingual intelligence
  ├── French language detection (franc library)
  ├── i18next for scalable translation management
  └── Automated franglais normalisation

Phase 3 — Community features
  ├── React Native / Expo mobile app (same component logic)
  ├── Federated moderation (community-led panels)
  └── Pol.is API integration for real opinion clustering
```

---

## Why This Project

I'm a bilingual journalist (FR/EN/VI) who has spent three years building and managing community-driven digital spaces — at La Rotonde, Francopresse, and Fika Ottawa. I understand what makes online communities fail from the inside.

Espace is built on a core belief: **francophone spaces online should reward participation, not punish imperfection.** People shouldn't have to choose between their two languages to feel welcome. That's not just a product feature — it's a reflection of how many Canadians actually live.

This prototype is my attempt to speak both languages at once: the language of journalism and community, and the language of code.
