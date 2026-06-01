# Contributing to Espace / Contribuer à Espace

## Development workflow / Flux de développement

This project follows an Agile iterative approach with short development cycles.

### Git branching strategy
```
main          ← stable, deployable
  └── dev     ← integration branch
        └── feature/tab-name     ← new features
        └── fix/issue-description ← bug fixes
        └── test/component-name  ← adding tests
```

### Commit message format
```
type(scope): short description in English or French

Types: feat | fix | refactor | test | docs | chore
Scope: home | debate | moderation | impact | api | types | hooks

Examples:
feat(home): add franglais detection to comment input
fix(debate): correct SVG cluster position on mobile
test(api): add integration tests for moderation endpoints
```

### Running locally
```bash
# Install dependencies
npm install

# Start API server (port 3001)
npm start

# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run API integration tests only
npm run test:api
```

### Bilingual requirement
Every user-facing string MUST be added as a `BilingualString` object:
```js
// ✅ Correct
const label = { fr: "Publier", en: "Post" };

// ❌ Incorrect
const label = "Publier";
```

### Adding a new feature (Agile checklist)
1. Open an issue using the feature template
2. Create a branch: `feature/your-feature-name`
3. Implement in the relevant component
4. Add/update types in `types.ts`
5. Add bilingual strings to `mockData.js`
6. Write unit or integration tests
7. Update `CHANGELOG.md`
8. Open a PR using the PR template
9. Merge to `dev`, then `main` after review
