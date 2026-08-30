# Polish 5 — cumulative zero-finding closure

**Released candidate:** `128edbfd6fc265032e162601baf2a2102cc1e687`  
**Review commit:** `edd4b3b262e918ab3c0c98ec1a78a09740ea839e`  
**Repair commit:** `415f82b`  
**Live URL:** <https://medication-handoff-card.sociobot.in>  
**Checked live:** 2026-08-30 UTC

All findings from reviews 1–5 are closed. The repair keeps the original
local-first PWA class and the kitchen-table paper, ink, coral, and serif visual
system from `design.md`.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained History API navigation, scroll restoration, focused route h1 elements, and polite announcements on forward and Back navigation. | Test `updates route focus, announcements, and metadata for navigation and Back`; [Privacy screenshot](evidence/polish-5-live/privacy-desktop.png); live `routes-metadata-focus` pass in [live-recheck.json](evidence/polish-5-live/live-recheck.json). |
| F-1-2 | Retained route-specific titles, descriptions, canonical URLs, Open Graph, and Twitter metadata for Home, Demo, Privacy, and Terms. | Same route test; [live Privacy verification](evidence/polish-5-live/verify-privacy/verify.json); live `/demo`, `/privacy`, and `/terms` metadata checks passed. |
| F-1-3 | Retained the exact free card/print/JSON and $12 encrypted-backup boundary. | Claims `@claim:core-features-free` and `@claim:checkout-available`; [cold Home](evidence/polish-5-live/home-mobile-cold.png); live checkout returned 303 to Dodo. |
| F-1-4 | Retained the record-only safety boundary in the landing page, editor, print card, README, and narrowed Terms copy. | Claim `@claim:non-clinical-scope`; [Terms screenshot](evidence/polish-5-live/terms-desktop.png); live Terms shows only the tested interaction/dose boundary. |
| F-1-5 | Retained local IndexedDB records, no account/sync surface, and no health-record upload during editing. | Claims `@claim:local-record` and `@claim:no-account-or-cloud-copy`; [Privacy screenshot](evidence/polish-5-live/privacy-desktop.png); live demo request flow stayed same-origin. |
| F-1-6 | Retained readable plain JSON coverage and omitted the unprovable passphrase-recovery promise. | Claims `@claim:json-backup`, `@claim:plain-json-readable`, and `@claim:encrypted-backup`; [live demo](evidence/polish-5-live/demo-mobile-cold.png); live Privacy states only the tested readable-copy behavior. |
| F-1-7 | Retained direct medicine-dialog Tab containment and kept low-value payment-provider-ID wording out of README. | Claim `@claim:dialog-keyboard`; [live demo](evidence/polish-5-live/demo-mobile-cold.png); live axe and console checks passed. |
| F-1-8 | Retained concrete **Change history** and **Privacy** headings and consistent card-owner terminology. | Test `shows required landing sections and product identity metadata`; [cold Home](evidence/polish-5-live/home-mobile-cold.png); live copy matches [copy-audit.md](copy-audit.md). |
| F-2-1 | Retained the compact demo-first view with the banner, Evelyn Parker, confirmation, Lisinopril dose/timing/prescriber, and Edit above the fold. | Test `opens the completed sample card above the fold after one click`; [cold demo](evidence/polish-5-live/demo-mobile-cold.png); live `first-screen-and-demo` passed at 390×844. |
| F-2-2 | Retained the true HTTP 404 with route metadata, favicon, product header/footer, legal links, and return action. | Test `ships a complete product shell and metadata on the designed 404`; [404 screenshot](evidence/polish-5-live/not-found-mobile.png); live `/polish-5-not-found` returned HTTP 404. |
| F-3-1 | Retained target-specific accessible names for every Edit and Stop action. | Test `names every sample medicine action with its target medicine`; [demo actions](evidence/polish-5-live/demo-mobile-cold.png); live all-route axe pass. |
| F-3-2 | Retained the verb-led **Open backup settings** header action. | Test `uses result-naming controls for backup settings and legal-page themes`; [desktop Home verification](evidence/polish-5-live/verify-home/screenshot-desktop.png); live label check passed. |
| F-3-3 | Retained dynamic **Use dark theme** / **Use light theme** labels. | Same result-naming test; [Privacy screenshot](evidence/polish-5-live/privacy-desktop.png); live legal-page theme label passed. |
| F-4-1 | Retained the exact license-request privacy boundary and recorded request assertion. | Claim `@claim:license-verification-data`; [Privacy screenshot](evidence/polish-5-live/privacy-desktop.png); live `license-verification-data` checked method, endpoint, query, empty body, and absence of card values. |
| F-4-2 | Retained only the observable checkout statement: Sociobot redirects to Dodo. | Claim `@claim:checkout-available`; [Privacy screenshot](evidence/polish-5-live/privacy-desktop.png); live checkout redirect passed and merchant-policy wording is absent. |
| F-4-3 | Retained only observable revoked-verdict behavior; a revoked response removes encrypted export while free JSON remains. | Claim `@claim:revoked-license-lock`; [revoked license screenshot](evidence/polish-5-live/revoked-license-mobile.png); live `revoked-license-lock` passed. |
| F-5-1 | Removed the unprovable hosting-log sentence. Replaced the combined paragraph with two narrow claims and added a build/request scanner for advertising and analytics code. | Claim `@claim:no-tracking-code`; [Privacy screenshot](evidence/polish-5-live/privacy-desktop.png); live `no-tracking-code` passed and no hosting-log text remains. |
| F-5-2 | Narrowed Terms to the existing tested boundary: the card records entered details and does not check interactions or recommend doses. | Claim `@claim:non-clinical-scope`; [Terms screenshot](evidence/polish-5-live/terms-desktop.png); live check confirms diagnosis, dispensing, and alert promises are absent. |
| F-5-3 | Added a real-card storage/deletion claim. It saves names, medicine, confirmation, theme, and fixture license; inspects IndexedDB/localStorage; clears all origin storage through Chromium; and confirms an empty card after reload. | Claim `@claim:storage-and-delete`; [cleared card screenshot](evidence/polish-5-live/storage-cleared-mobile.png); live `storage-and-delete` passed. |

## Verification

- All 19 literal commands in `.factory/claims.json`: **PASS** from clean clone
  `/tmp/mhc-polish5-claims-q7PND1/repo`; every tagged test passed in desktop
  and 390×844 projects.
- `CI=1 npm test`: **PASS** — 11 Vitest checks and 78 Playwright checks.
- `npm run lint`: **PASS**.
- `npm run build`: **PASS** — JavaScript 45.87 kB raw / 14.20 kB gzip;
  CSS 20.47 kB raw / 5.28 kB gzip.
- Local Lighthouse demo: **100 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO**; LCP 1152.61 ms, CLS 0, TBT 80.5 ms.
- Live Lighthouse demo: **100/100/100/100**; LCP 1058.21 ms, CLS 0,
  TBT 31 ms. Report: [lighthouse-demo.json](evidence/polish-5-live/lighthouse-demo.json).
- Local and live `verify-url.sh` passed Home, Demo, Privacy, and Terms with one
  h1, `lang=en`, a main landmark, named controls, image alternatives, and no
  console errors.
- Live Playwright axe found no serious or critical issue on Home, Demo,
  Privacy, Terms, or 404. Offline demo reload, checkout, routing, focus,
  link crawl, security headers, storage deletion, and bundle identity also
  passed.

## Deployment

`dist/` was deployed with
`/opt/fleet/lib/deploy-static.sh medication-handoff-card dist` to Static Web
App `sf-medication-handoff-card` in resource group `sociobot`. Deployment ID:
`db0a8f1c-1ed8-4a46-95a8-a70a5fcb37da`. The deployed JavaScript SHA-256 is
`51c87f98254600282e1899badd8bacc73f2e4689724050a807a0a3a92c8d5147`,
identical to the local release artifact.

No review finding or additional defect remains open.
