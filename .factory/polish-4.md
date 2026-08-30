# Polish 4 — cumulative zero-finding closure

**Released candidate:** `2f5ab192a48e84b12ea837ed073c29f668e51251`  
**Review commit:** `b3d9b5d9f46a19bef4152579434eb9cfb8f44f22`  
**Repair commits:** `6f0ba7d`, `b0a0194`  
**Live URL:** <https://medication-handoff-card.sociobot.in>  
**Checked live:** 2026-08-30 UTC

All findings from reviews 1–4 are closed. The app remains a local-first PWA
with the kitchen-table paper, ink, coral, and serif document identity from
`design.md`.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained History API navigation, scroll restoration, focused route h1 elements, and polite announcements on forward and Back navigation. | Test `updates route focus, announcements, and metadata for navigation and Back`; live `routes-metadata-focus` in [`live-recheck.json`](evidence/polish-4-live/live-recheck.json); [`privacy-desktop.png`](evidence/polish-4-live/privacy-desktop.png). |
| F-1-2 | Retained route-specific titles, descriptions, canonical URLs, Open Graph, and Twitter metadata for Home, Demo, Privacy, and Terms. | Same route test; live `routes-metadata-focus`; live verify reports for [Home](evidence/polish-4-live/verify-home/verify.json) and [Demo](evidence/polish-4-live/verify-demo/verify.json). |
| F-1-3 | Retained the exact free card/print/JSON and $12 encrypted-backup boundary. | Claims `@claim:core-features-free` and `@claim:checkout-available`; [`home-mobile-cold.png`](evidence/polish-4-live/home-mobile-cold.png); live checkout redirect passed. |
| F-1-4 | Retained the record-only safety boundary in the app, editor, print card, README, and Terms. | Claim `@claim:non-clinical-scope`; [`demo-mobile-cold.png`](evidence/polish-4-live/demo-mobile-cold.png). |
| F-1-5 | Retained local IndexedDB storage, no account/sync surface, and no health-record upload. | Claims `@claim:local-record` and `@claim:no-account-or-cloud-copy`; live demo request-origin assertion passed. |
| F-1-6 | Retained readable plain JSON coverage and kept unsupported passphrase-recovery wording out of the product. | Claims `@claim:plain-json-readable`, `@claim:json-backup`, and `@claim:encrypted-backup`; [`revoked-license-mobile.png`](evidence/polish-4-live/revoked-license-mobile.png). |
| F-1-7 | Retained direct Tab-containment coverage for native medicine dialogs and kept provider-ID implementation copy out of README. | Claim `@claim:dialog-keyboard`; full 74-browser-test run. |
| F-1-8 | Retained **Change history**, **Privacy**, and consistent card-owner/person-keeping-the-card terminology. | Test `shows required landing sections and product identity metadata`; [`copy-audit.md`](copy-audit.md). |
| F-2-1 | Retained the compact demo first screen with banner, Evelyn Parker, confirmation details, and editable Lisinopril summary above the fold. | Test `opens the completed sample card above the fold after one click`; live `first-screen-and-demo`; [`demo-mobile-cold.png`](evidence/polish-4-live/demo-mobile-cold.png). |
| F-2-2 | Retained a true HTTP 404 with route metadata, favicon, product header/footer, legal links, and return action. | Test `ships a complete product shell and metadata on the designed 404`; live `http-404`; [`not-found-mobile.png`](evidence/polish-4-live/not-found-mobile.png). |
| F-3-1 | Retained target-specific accessible names for every sample medicine action. | Test `names every sample medicine action with its target medicine`; [`demo-mobile-cold.png`](evidence/polish-4-live/demo-mobile-cold.png). |
| F-3-2 | Retained the verb-led **Open backup settings** header control. | Test `uses result-naming controls for backup settings and legal-page themes`; live Home/Demo verify reports. |
| F-3-3 | Retained dynamic **Use dark theme** and **Use light theme** controls. | Same result-naming test; [`privacy-desktop.png`](evidence/polish-4-live/privacy-desktop.png). |
| F-4-1 | Reworded Privacy to accurately name the token and product identifier, then added a request-inspection claim that proves the GET path, sole query field, empty body, and absence of sample card values. | Claim `@claim:license-verification-data`; live `license-verification-data`; [`privacy-desktop.png`](evidence/polish-4-live/privacy-desktop.png). |
| F-4-2 | Removed unsupported operator, merchant-of-record, and payment-privacy assertions. Retained only the observed Sociobot-to-Dodo redirect. | Claim `@claim:checkout-available`; live `checkout-redirect`; [`privacy-desktop.png`](evidence/polish-4-live/privacy-desktop.png). |
| F-4-3 | Removed the unprovable refund-causation promise. The remaining copy states only observable behavior: a revoked verification response locks encrypted export. Added a recorded revoked-response claim. | Claim `@claim:revoked-license-lock`; live `revoked-license-lock`; [`terms-desktop.png`](evidence/polish-4-live/terms-desktop.png) and [`revoked-license-mobile.png`](evidence/polish-4-live/revoked-license-mobile.png). |

## Additional defect found and closed

The final cold audit caught transient low contrast while rows faded in. Row and
dialog motion now uses transform only, so text remains fully opaque. The design
motion policy was updated, a regression test named `keeps text contrast valid
while demo rows enter` was added, and the final live axe scan passed Home,
Demo, Privacy, Terms, and 404 with no serious or critical violations.

## Verification

- Every literal command in `.factory/claims.json`: **17/17 passed** from the
  clean clone `/tmp/mhc-polish4-claims-76E88k/repo`; each tagged browser test
  passed in desktop and 390 px projects.
- `CI=1 npm test`: **PASS** — 10 Vitest tests and 74 Playwright tests.
- `npm run build`: **PASS** — `dist/index.html`; JavaScript 45.99 kB raw /
  14.28 kB gzip, CSS 20.47 kB raw / 5.28 kB gzip.
- Local Lighthouse demo: 100 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO; LCP 1098.45 ms, CLS 0, TBT 0.
- Live Lighthouse demo: 100 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO; LCP 1052.65 ms, CLS 0, TBT 57.5 ms. Report:
  [`lighthouse-demo.json`](evidence/polish-4-live/lighthouse-demo.json).
- Live `verify-url.sh` passed Home and `?demo=1` with HTTP 200, one h1,
  `lang=en`, a main landmark, named controls, image alternatives, and no
  console errors.
- The live recheck also passed one-click demo entry, sample reset/exit
  isolation, same-origin demo requests, route focus and metadata, all-route
  axe, explicit license-request inspection, revoked-license locking, offline
  reload, HTTP 404, live checkout redirect, and zero unexpected console/page
  errors.

## Deployment

`dist/` was deployed through
`/opt/fleet/lib/deploy-static.sh medication-handoff-card dist` to Static Web
App `sf-medication-handoff-card` in resource group `sociobot`. Final deployment
ID: `228ef627-2b20-4f07-9db1-1c1c003bde6c`. The live JavaScript SHA-256 is
`8832c4d37f4fbdce99c3a22bfdbcef7dc03e9a482652473ece3038c243f14587`,
identical to the local release artifact.

No review finding or additional defect remains open.
