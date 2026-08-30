# Polish 3 — cumulative zero-finding closure

**Released candidate:** `5b5a5397790c031d19dd52e38cc1cae0eb1bb485`  
**Review commit:** `70639b33743069232d7d11b511d72744cd666898`  
**Repair commits:** `cf783deb5300b16f505366f8fb51003c430d8aa1`, `955b20f271b409aed7e3b43cda187ea08b830bd6`  
**Live URL:** <https://medication-handoff-card.sociobot.in>  
**Live check:** 2026-08-30 UTC

All 13 findings from reviews 1–3 are closed. The repair preserves the
kitchen-table paper/ink/coral visual system and the original PWA/offline
deployment class.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained History API navigation, restored scroll, focused `h1` elements, and polite route announcements on forward and Back navigation. | Test: `updates route focus, announcements, and metadata for navigation and Back`. Screenshot: [`privacy-desktop.png`](evidence/polish-3-live/privacy-desktop.png). Live: `/` → `/privacy` → Back passed as `privacy-route-focus` and `back-route-focus` in [`live-recheck.json`](evidence/polish-3-live/live-recheck.json). |
| F-1-2 | Retained route-specific title, description, canonical, Open Graph, and Twitter metadata for Home, Demo, Privacy, and Terms. | Test: `updates route focus, announcements, and metadata for navigation and Back`. Screenshot: [`privacy-desktop.png`](evidence/polish-3-live/privacy-desktop.png). Live: `/demo`, `/privacy`, and `/terms` exact title/canonical checks passed in `live-recheck.json`. |
| F-1-3 | Retained the exact free-core and $12-once boundaries in copy and in the claim catalogue. Updated claim locations to the renamed settings action. | Tests: `@claim:core-features-free`, `@claim:checkout-available`. Screenshot: [`home-mobile-cold.png`](evidence/polish-3-live/home-mobile-cold.png). Live: the cold home first screen shows the exact free/paid fact; `/demo` exposes print and plain backup before any license. |
| F-1-4 | Retained the record-only safety boundary in the editor, landing safety note, terms, and print card. | Test: `@claim:non-clinical-scope`. Screenshot: [`demo-mobile-cold.png`](evidence/polish-3-live/demo-mobile-cold.png). Live: `/?demo=1` visibly states “Communication tool, not medical advice” and exposes no checking or recommendation action. |
| F-1-5 | Retained local IndexedDB records, no sign-in/sync UI, and no health-record network request. | Tests: `@claim:local-record`, `@claim:no-account-or-cloud-copy`. Screenshot: [`privacy-desktop.png`](evidence/polish-3-live/privacy-desktop.png). Live: `same-origin-demo-requests` passed with only `https://medication-handoff-card.sociobot.in` in `live-recheck.json`. |
| F-1-6 | Retained readable plain JSON and the narrowed passphrase instruction; no unrecoverable-passphrase promise was reintroduced. | Tests: `@claim:plain-json-readable`, `@claim:json-backup`, `@claim:encrypted-backup`. Screenshot: [`settings-desktop.png`](evidence/polish-3-live/settings-desktop.png). Live: `/demo` opens free JSON restore/download and the separate encrypted option. |
| F-1-7 | Retained the direct native-dialog Tab containment test and kept the low-value provider-ID sentence out of README. | Test: `@claim:dialog-keyboard`. Screenshot: [`settings-desktop.png`](evidence/polish-3-live/settings-desktop.png). Live: the settings and medicine dialogs expose named native controls with no axe serious/critical violation. |
| F-1-8 | Retained the concrete **Change history** and **Privacy** headings and consistent card-owner/person-keeping-the-card terms. | Test: `shows required landing sections and product identity metadata`; audit: [`copy-audit.md`](copy-audit.md). Screenshot: [`verify-home/screenshot-desktop.png`](evidence/polish-3-live/verify-home/screenshot-desktop.png). Live: Home copy and headings match the audited terms. |
| F-2-1 | Retained the compact demo-first composition: banner, Evelyn Parker, confirmation, and Lisinopril details appear before the fold at both target viewports. | Test: `opens the completed sample card above the fold after one click`. Screenshots: [`demo-mobile-cold.png`](evidence/polish-3-live/demo-mobile-cold.png), [`demo-desktop-cold.png`](evidence/polish-3-live/demo-desktop-cold.png). Live: `mobile-sample-above-fold` and `desktop-sample-above-fold` passed in `live-recheck.json`. |
| F-2-2 | Retained the true HTTP 404 with its own metadata, favicon, product header/footer, Privacy, Terms, and return action. | Tests: `ships a complete product shell and metadata on the designed 404`, release-config 404 regression. Screenshot: [`not-found-mobile.png`](evidence/polish-3-live/not-found-mobile.png). Live: `/polish-3-not-found` returned 404; `404-metadata`, `404-shell`, and `404-legal-links` passed. |
| F-3-1 | Added `aria-label="Edit <medicine>"` and `aria-label="Stop and remove <medicine>"` to every medicine row, plus the compact sample Edit action. | Test: `names every sample medicine action with its target medicine`. Screenshot: [`demo-mobile-cold.png`](evidence/polish-3-live/demo-mobile-cold.png). Live: all six names for Lisinopril, Metformin ER, and Vitamin D3 passed, while both generic-name counts were zero in `live-recheck.json`. |
| F-3-2 | Renamed the visible header action from **Backup & settings** to **Open backup settings** while retaining the concise dialog heading. | Tests: `uses result-naming controls for backup settings and legal-page themes`, landing identity regression. Screenshot: [`verify-home/screenshot-desktop.png`](evidence/polish-3-live/verify-home/screenshot-desktop.png). Live: `first-screen-settings-copy` and `desktop-settings-copy` passed. |
| F-3-3 | Replaced **Theme** with the next concrete result, **Use dark theme** or **Use light theme**, and update the label after activation. | Test: `uses result-naming controls for backup settings and legal-page themes`. Screenshot: [`privacy-desktop.png`](evidence/polish-3-live/privacy-desktop.png). Live: `privacy-theme-result-label`, `theme-result`, and `theme-next-label` passed. |

## Verification

- Every literal command in `.factory/claims.json`: **15/15 passed** from clean
  clone `/tmp/mhc-polish3-claims-UQXRqy/repo` at `955b20f`; each tagged test
  passed in both desktop and 390 px projects.
- `CI=1 npm test`: **PASS** — 10 Vitest and 68 Playwright tests.
- `npm run build`: **PASS** — `dist/index.html`; JS 45.92 kB raw / 14.31 kB
  gzip, CSS 20.49 kB raw / 5.28 kB gzip.
- Local and live `verify-url.sh`: Home and `?demo=1` both passed with one h1,
  `lang=en`, a main landmark, named buttons, image alternatives, and zero
  console errors.
- Live Playwright axe: zero serious/critical violations on Home, Demo,
  Privacy, Terms, and the HTTP 404.
- Live offline check: a fresh context loaded `?demo=1`, enabled offline mode,
  reloaded, and retained Evelyn Parker plus the visible Offline state. See
  [`demo-offline-mobile.png`](evidence/polish-3-live/demo-offline-mobile.png).
- Live Lighthouse mobile demo: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100, LCP 989.55 ms, CLS 0, TBT 0. Report:
  [`lighthouse-demo.json`](evidence/polish-3-live/lighthouse-demo.json).
- Live crawl: `/`, `/demo`, `/privacy`, `/terms`, manifest, service worker,
  favicon, and social image returned 200; the unknown route returned 404.
  Production serves the repaired `index-DyRqq8DO.js` bundle.

## Deployment

The factory static deploy uploaded `dist/` to `sf-medication-handoff-card` in
Azure resource group `sociobot` (deployment
`2d2ee074-ea06-4106-acc3-8f51780593b6`). The default host is
`delightful-water-039582310.7.azurestaticapps.net`; the custom URL was then
opened cold in new mobile and desktop contexts. All 41 live recheck assertions
passed with no product console or page errors.
