# Medication Handoff Card — polish round 3 handoff

## Outcome

**PASS — no review finding remains open.** All findings in `review-1.md`,
`review-2.md`, and `review-3.md` are implemented, tested, deployed, and checked
on the custom production URL. The complete finding-to-evidence map is in
[`polish-3.md`](polish-3.md).

The repair gives every medicine-row action a target-specific accessible name,
renames the header action to **Open backup settings**, and makes each theme
control state its next result. Earlier fixes remain intact: the clear first
screen, isolated `?demo=1` sample, claims contract, real routing and metadata,
route focus, designed 404, legal links, mobile layout, privacy, and offline
behavior.

The paper/ink/coral “kitchen table before the appointment” identity is
unchanged. Version 1.0.4 and service-worker cache `mhc-v8` ensure installed
copies receive this repair.

## Source and deployment

- Repair commits: `cf783deb5300b16f505366f8fb51003c430d8aa1` and
  `955b20f271b409aed7e3b43cda187ea08b830bd6`.
- Both commits were pushed to `origin/main` before deployment.
- Work-order deploy: `/opt/fleet/lib/deploy-static.sh medication-handoff-card dist`.
- Azure Static Web App: `sf-medication-handoff-card`, resource group `sociobot`.
- Deployment ID: `2d2ee074-ea06-4106-acc3-8f51780593b6`.
- Default host: <https://delightful-water-039582310.7.azurestaticapps.net>.
- Production URL: <https://medication-handoff-card.sociobot.in>.
- Production bundle: `index-DyRqq8DO.js` and `index-D_YOD3aU.css`.

## Verification evidence

### Claims from a clean clone

Every exact command in `.factory/claims.json` passed from
`/tmp/mhc-polish3-claims-UQXRqy/repo` at commit `955b20f`. All 15 claim IDs
passed in both Playwright projects:

`demo-isolation`, `local-record`, `offline-reload`, `json-backup`,
`full-history-backup`, `print-card`, `dialog-keyboard`, `encrypted-backup`,
`record-workflow`, `adaptive-interface`, `checkout-available`,
`core-features-free`, `non-clinical-scope`, `no-account-or-cloud-copy`, and
`plain-json-readable`.

The first clean-clone pass exposed only a 60-second test timeout in the
21-edit full-history case. Commit `955b20f` raised that single test cap to 120
seconds; the complete claim matrix was restarted from a new clean clone and
passed 15/15.

### Full local suite and build

- `CI=1 npm test`: **PASS** — 10 Vitest tests and 68 Playwright tests.
- Coverage includes desktop and 390×844 mobile, light/dark, reduced motion,
  axe, keyboard focus containment, route focus/Back, demo reset/isolation,
  same-origin privacy logging, offline reload, JSON/encrypted backup,
  one-page PDF, malformed imports, maximum-length wrapping, licensing, and
  HTTP-404 structure.
- `npm run build`: **PASS** — `dist/index.html` is at the artifact root.
- Initial JS: 45.92 kB raw / 14.31 kB gzip.
- CSS: 20.49 kB raw / 5.28 kB gzip.
- Largest shipped hero fallback: 147.37 kB; mobile WebP: 21.78 kB.
- Local Lighthouse demo: 100 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO; LCP 1098.27 ms, CLS 0, TBT 0.

### Cold production recheck

A new Chromium context opened the custom URL cold at 390×844 and 1440×900.
All 41 checks in
[`live-recheck.json`](evidence/polish-3-live/live-recheck.json) passed:

- the home action is above the phone fold and opens `?demo=1` in one click;
- the demo banner, Reset demo, Start for real, Evelyn Parker, and Lisinopril
  are visible before scrolling;
- edit/reset restores the original sample while all requests remain same-origin;
- all six row actions name Lisinopril, Metformin ER, or Vitamin D3;
- **Open backup settings** is exposed on mobile and desktop;
- **Use dark theme** changes the theme and becomes **Use light theme**;
- Privacy navigation and browser Back focus the new h1 and announce the route;
- Demo, Privacy, and Terms expose their exact titles and canonical URLs;
- an unknown URL returns HTTP 404 with its own metadata, header, footer,
  Privacy link, Terms link, and return action;
- axe found zero serious/critical issues on Home, Demo, Privacy, Terms, and 404;
- no unexpected console or page errors occurred.

`verify-url.sh` also passed live Home and `?demo=1` with HTTP 200, one h1,
`lang=en`, a main landmark, complete alt text, named buttons, and zero console
errors. A fresh live service-worker context reloaded the populated demo while
fully offline. Live Lighthouse mobile scores are 100/100/100/100 with LCP
989.55 ms, CLS 0, and TBT 0.

Key screenshots:

- [Cold mobile home](evidence/polish-3-live/home-mobile-cold.png)
- [Cold mobile demo](evidence/polish-3-live/demo-mobile-cold.png)
- [Cold desktop demo](evidence/polish-3-live/demo-desktop-cold.png)
- [Offline mobile demo](evidence/polish-3-live/demo-offline-mobile.png)
- [Desktop privacy route](evidence/polish-3-live/privacy-desktop.png)
- [Desktop backup settings](evidence/polish-3-live/settings-desktop.png)
- [Designed mobile 404](evidence/polish-3-live/not-found-mobile.png)
- [Live Lighthouse JSON](evidence/polish-3-live/lighthouse-demo.json)

## Run and verify

```sh
npm ci
npm test
npm run build
npm run preview
```

Run any claim exactly as declared in `.factory/claims.json`; for example:

```sh
npm ci --ignore-scripts --no-audit --no-fund && npm run test:e2e -- --grep @claim:demo-isolation
```

## Known gaps and next steps

No known product, review, accessibility, claim, privacy, offline, routing,
mobile, or deployment gaps remain in this work order. No follow-up is required
for acceptance.
