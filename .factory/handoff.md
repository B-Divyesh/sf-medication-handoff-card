# Medication Handoff Card — polish-2 handoff

## Release status

**PASS — deployed 2026-08-29 UTC.**

Repair commit: `2cc86b9` (`fix: show demo card above fold and complete 404`).
The deployed artifact is `dist/`, served at
<https://medication-handoff-card.sociobot.in>. It uses service-worker cache
`mhc-v7` and manifest start URL `/?v=6` so installed cards receive the repair.

## What changed

- `/demo` and `?demo=1` now enter directly into Evelyn Parker’s compact,
  editable sample card. Lisinopril, 10 mg, timing, prescriber, Edit, the demo
  banner, Reset demo, and Start for real are visible on the first 390 × 844
  screen. Demo storage remains `demo:medication-handoff-card`.
- The static 404 now has its own metadata/social identity, favicon, skip link,
  product header, and legal footer while retaining a real HTTP 404 response.
- Added browser regressions for the above-the-fold demo and full 404 shell;
  updated PWA cache/manifest versions and the catalog sentence.

## Exact verification

- `CI=1 npm test` passed: 10 Vitest and 64 Playwright checks.
- `npm run build` passed and wrote `dist/index.html`; JS 14.26 kB gzip, CSS
  5.28 kB gzip.
- All 15 `claims.json` commands passed from separate clean clones. The clones
  are retained at `/tmp/mhc-claims-3oY4Ib` and every recorded last-run status
  is `passed`.
- Live `verify-url.sh` passed for Home and `?demo=1`, with zero console errors.
- Live Playwright axe scan found no violations on Home, Demo, or 404.
- Lighthouse mobile demo measured Performance 100, Accessibility 100, LCP
  1133.65 ms, and CLS 0.
- Static deployment completed via work-order resource
  `sf-medication-handoff-card` / `sociobot`; a cold live check verified the new
  asset `index-Cgku02pB.js`, demo first viewport, metadata/focus/Back behavior,
  and HTTP 404 shell.

Evidence and the finding-by-finding closure table are in
[polish-2.md](polish-2.md). Live machine-readable evidence is under
`/.factory/evidence/polish-2-live/`.

## Run locally

```sh
npm ci
CI=1 npm test
npm run build
```

Open `/?demo=1` or `/demo` for isolated sample data. `Reset demo` restores the
sample; `Start for real` discards it and opens a separate real card. See
`.factory/claims.json` for every exact claim command.

## Known gaps

None.
