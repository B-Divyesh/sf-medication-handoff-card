# Medication Handoff Card

Medication Handoff Card is a private, offline-first record for adult children,
caregivers, and older adults who need to hand family or clinicians a clear,
dated medication list. It focuses on human handoffs: the current list, who
confirmed it, and a visible record of what changed.

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
- Offers an optional $12 one-time license for AES-256 encrypted backups. The
  core record, print flow, and plain export stay free.
- Includes light/dark themes, reduced-motion behavior, keyboard-ready native
  dialogs, and responsive layouts down to 390 px and below.

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

The static deploy artifact is `dist/`, with `dist/index.html` at its root. No
runtime environment variables are required. Deploy the directory with SPA
fallbacks to `index.html` for `/privacy` and `/terms`.

## Data and licensing

Medication data never leaves the browser unless the user downloads a backup.
Plain `.json` backups are readable. Paid `.mhc` backups use AES-GCM with a
256-bit key derived from the user's passphrase via PBKDF2-SHA-256 (250,000
iterations); the passphrase is never stored and cannot be recovered.

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
- `.factory/handoff.md` — release verification and known gaps.

## License

MIT. See [LICENSE](LICENSE).
