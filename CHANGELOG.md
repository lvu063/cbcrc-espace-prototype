# Changelog — Espace

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/).

---

## [1.0.0] — 2026-05-31

### Added
- Initial prototype — four-tab bilingual interface (FR/EN)
- `useLanguage` custom React hook with `t()` bilingual resolver
- HomeTab: comment feed with positivity nudge, franglais detection, reputation badges
- DebateTab: Pol.is-inspired opinion mapping with SVG cluster visualisation
- ModerationTab: AI-assisted moderation dashboard with toxicity scoring
- ImpactTab: animated count-up stats, language breakdown chart, recognition wall
- Express.js REST API with 10 endpoints
- Mock toxicity scorer (Perspective API integration documented)
- TypeScript type definitions covering all data models
- Jest unit tests for `useLanguage` hook (11 tests)
- Jest integration tests for REST API (18 tests)
- Bilingual mock data layer (`mockData.js`) — API-ready schema
- Firebase Realtime Database schema documented in `types.ts`
- GitHub PR template and issue templates (bilingual)

### Architecture decisions
- No external UI library — components built from scratch
- SVG charts without Chart.js/Recharts — demonstrates rendering knowledge
- Inline CSS-in-JS for component-scoped styling
- Mock data separated from components for easy API migration
- CommonJS (`mockData.cjs`) for server compatibility alongside ES modules

---

## [0.2.0] — 2026-05-30 (prototype iteration)

### Added
- ModerationTab with animated card removal on action
- ImpactTab recognition wall with weekly contributor highlight
- Consensus insight reveal after debate vote

### Changed
- DebateTab clusters now animate on vote (opacity + radius transition)
- HomeTab positivity nudge now dismissable with Revise button

---

## [0.1.0] — 2026-05-29 (initial concept)

### Added
- Basic bilingual toggle (FR/EN)
- HomeTab with static comment feed
- Initial mockData structure
