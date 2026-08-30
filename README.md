# Medication Handoff Card

Medication Handoff Card helps adult children, caregivers, and older adults
make a clear, dated medication handoff card for family or clinicians. It keeps
the current list, who confirmed it, and what changed together.

Live site: <https://medication-handoff-card.sociobot.in>

This is a communication tool, not medical advice. It does not check drug
interactions or recommend doses. Medication decisions must be confirmed with a
qualified clinician or pharmacist.

## What it does

- Records medicine name, dose/strength, timing, prescriber, and notes.
- Preserves a dated change history when medicines are added, edited, or stopped.
- Records the card owner, person keeping the card, confirmation date, and
  confirmed by.
- Produces a large-type, one-page print/PDF handoff card.
- Stores health data locally in IndexedDB; there is no health-data account or
  cloud copy.
- Exports and restores a portable plain JSON backup. Downloaded JSON can be
  opened as text.
- Works offline after the first visit.
- Offers an optional $12 one-time license for passphrase-protected backups. The
  card, print view, and plain JSON backup are free.
- Includes light and dark themes, reduced-motion behavior, medicine dialogs
  that keep Tab focus inside, and a responsive 390 px phone layout.

## Try the sample card

Open [the demo](https://medication-handoff-card.sociobot.in/demo) for Evelyn
Parker's three-medicine card. Demo data uses a separate local database named
`demo:medication-handoff-card`. The persistent demo banner can reset it or
start a separate real card without copying the sample.
Leaving the demo discards any sample edits.

## Local development

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Vite prints the local development URL. Production service-worker registration
is intentionally disabled during `npm run dev`.

## Test and build

Playwright 1.58.2 is pinned. The factory image includes its Chromium build at
`$PLAYWRIGHT_BROWSERS_PATH`; elsewhere, run `npx playwright install chromium`
once.

```sh
npm test          # unit + desktop/mobile browser + offline + axe checks
npm run build     # exact production build command
npm run preview   # inspect the built PWA locally
```

Each public product claim has a tagged regression test declared in
`.factory/claims.json`. Every exact command includes its own clean dependency
install, so it also runs from a fresh clone. For example:

```sh
npm ci --ignore-scripts --no-audit --no-fund && npm run test:e2e -- --grep @claim:offline-reload
```

The static deploy artifact is `dist/`, with `dist/index.html` at its root. No
runtime environment variables are required. `staticwebapp.config.json` ships
the enforced CSP, immutable hashed-asset caching, manifest MIME type, SPA
routes, and the designed 404 response for static deployment.

## Data and licensing

Medication data stays in the browser unless the user downloads a backup. Plain
`.json` backups can be opened as text. Store an encrypted-backup passphrase
somewhere safe.

Checkout starts at the Sociobot billing API and redirects to Dodo. The live
product is registered at $12. License checks send the token and product name,
not card details. A revoked result locks encrypted backups again. Returned
licenses are stored as `sb_license:medication-handoff-card`.

## Project map

- `src/main.ts` — UI, workflows, print card, import/export, and PWA lifecycle.
- `src/db.ts` — IndexedDB persistence.
- `src/crypto.ts` — encrypted backup format.
- `src/license.ts` — Sociobot one-time license capture and daily verification.
- `public/sw.js` — versioned app-shell and runtime cache.
- `.factory/design.md` — product-specific visual system and asset provenance.
- `.factory/demo.md` — demo data and local storage isolation.
- `.factory/claims.json` — public claims and exact regression commands.
- `.factory/handoff.md` — release verification and known gaps.

## License

MIT. See [LICENSE](LICENSE).
