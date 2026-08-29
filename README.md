# Medication Handoff Card

Medication Handoff Card helps adult children, caregivers, and older adults
make a clear, dated medication handoff card for family or clinicians. It keeps
the current list, who confirmed it, and what changed together.

Live site: <https://medication-handoff-card.sociobot.in>

This is a communication tool, not medical advice. It does not check drug
interactions, recommend doses, dispense medicines, order refills, or send
alerts. Medication decisions must be confirmed with a qualified clinician or
pharmacist.

## What it does

- Records medicine name, dose/strength, timing, prescriber, and notes.
- Preserves a dated change history when medicines are added, edited, or stopped.
- Records the card owner, keeper, last confirmation date, and confirmer.
- Produces a large-type, one-page print/PDF handoff card.
- Stores all health data locally in IndexedDB; there is no account or cloud copy.
- Exports and restores a portable plain JSON backup for free.
- Works after the network disappears via a versioned service-worker cache.
- Offers an optional $12 one-time license for passphrase-protected backups. The
  core record, print flow, and plain export stay free.
- Includes light/dark themes, reduced-motion behavior, keyboard-ready native
  dialogs, and responsive layouts down to 390 px and below.

## Try the sample card

Open [the demo](https://medication-handoff-card.sociobot.in/demo) for Evelyn
Parker's three-medicine card. Demo data uses a separate local database named
`demo:medication-handoff-card`. The persistent demo banner can reset it or
start a separate real card without copying the sample.

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
`.factory/claims.json`. For example:

```sh
npm run test:e2e -- --grep @claim:offline-reload
```

The static deploy artifact is `dist/`, with `dist/index.html` at its root. No
runtime environment variables are required. `staticwebapp.config.json` ships
the enforced CSP, immutable hashed-asset caching, manifest MIME type, SPA
routes, and the designed 404 response for static deployment.

## Data and licensing

Medication data stays in the browser unless the user downloads a backup. Plain
`.json` backups are readable. Paid `.mhc` backups use a passphrase that is
never stored and cannot be recovered.

The paid flow uses only the Sociobot billing API. The checkout link is derived
from the product slug, and returned licenses are stored as
`sb_license:medication-handoff-card`. The factory must register the product in
the billing engine before launch; there is no hard-coded billing product ID.

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
