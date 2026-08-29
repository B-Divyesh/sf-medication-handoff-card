# Medication Handoff Card — repair handoff

## Release status

**PASS — deployed 2026-08-29 UTC.**

The repair commit is `e74a287d3d15f78a30fc566451a892ad23be9df4`
(`fix: repair release-blocking QA findings`). It was pushed to `main` and
deployed as Azure Static Web Apps deployment
`60a4ec7e-2761-45c6-869f-1a10b9cf6749`.

Live identity was verified at
<https://medication-handoff-card.sociobot.in>: the live
`index-eTnJiOPs.js` SHA-256 is
`2412c9e1ef12c2f304cc9f145aad55985eb1c246d673e8f42c4a9e1fe5c31670`,
matching `dist/`; the live service worker is `mhc-v6` and the manifest starts
at `/?v=5`.

## Repaired verifier findings

- Required medicine, stop-reason, confirmation, and card-owner fields now
  reject whitespace-only input after trimming. Invalid fields stay in the open
  dialog with field-linked, announced errors; no local record is written.
- A license token is locked until this device has an explicit cached or fresh
  `valid: true` verdict. First-time 429/offline/error responses cannot expose
  encrypted backup; a prior verified cached verdict still works offline.
- Explicit dark settings uses a higher-contrast accent. Axe passes with the
  settings dialog open after changing themes in the app.
- The public full-history backup sentence is now declared as
  `full-history-backup` and tested with 23 history entries while only 20 are
  visible.
- Reported mobile links now have at least 46 × 46 CSS-pixel boxes, including
  header, footer, and settings legal links. Other app links that were below
  baseline were raised too.
- The PWA cache was versioned from `mhc-v5` to `mhc-v6` and the manifest start
  URL from `?v=4` to `?v=5`, so installed cards receive this repair.

## Verification evidence

Commands run from this repository:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run lint
CI=1 npm test
npm run build
```

- Clean install: PASS (60 packages).
- Type/lint: PASS.
- Full test suite: PASS — 10 Vitest checks and 60 Playwright checks across
  desktop and 390 × 844 mobile.
- Production build: PASS; `dist/index.html` exists. Initial JS is 44.46 kB
  raw / 14.05 kB gzip; CSS is 19.40 kB raw / 5.10 kB gzip.
- All 15 literal commands in `.factory/claims.json` were run with their own
  clean install and passed in desktop and mobile. The final `mhc-v6` build also
  reran the literal `@claim:offline-reload` command successfully.
- Local Lighthouse 13.4.1 on `/demo`: Performance 100, Accessibility 100,
  Best Practices 100, SEO 100; FCP 0.9 s, LCP 0.9 s, CLS 0.
- Playwright Axe checks pass on home, demo, legal pages, dark demo, and the
  open explicit-dark settings dialog. Keyboard dialog trapping, visible focus,
  reduced motion, 390px fit, JSON/print/export, and same-origin privacy flows
  are covered by the suite.
- A controlled local service-worker update from `mhc-v6` to a test worker
  displayed “A fresh version is ready. Reload when convenient.” with no page
  errors. Live offline reload after first visit kept Evelyn Parker visible and
  showed the Offline notice without errors.
- Live smoke tests re-ran the whitespace block, controlled first-time 429
  license lock, explicit-dark Axe check, touch-target measurements, and
  same-origin request check. The 390px live page had no horizontal overflow or
  console errors.
- Live `/`, `/demo`, `/privacy`, and `/terms` return 200; the designed unknown
  route returns 404. The live manifest has the correct MIME type and `no-cache`;
  `sw.js` has `no-cache`; routes retain CSP, Referrer-Policy, nosniff, and
  Permissions-Policy headers.

This is a static local-first PWA, so no package/consumer API applies.

## How to run and verify

```sh
npm ci
npm test
npm run build
npm run preview
```

Open `/demo` for the isolated sample card. The complete claim contract and its
exact commands are in `.factory/claims.json`.

## Known gaps and next steps

No release-blocking gaps are known. Future changes to cached PWA assets should
bump the service-worker cache version and manifest start-url version together.
