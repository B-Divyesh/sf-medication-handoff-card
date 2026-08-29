# Polish 2 — cumulative review closure

**Repaired candidate:** `14f00da0ac55b457eb508098996af0c1b6c56461`  
**Repair commit:** `2cc86b9`  
**Live URL:** <https://medication-handoff-card.sociobot.in>  
**Checked live:** 2026-08-29 UTC

All findings in `review-1.md`, `review-2.md`, and `polish-1.md` are closed.
The repair keeps the kitchen-table document treatment, paper/ink/coral palette,
and serif record voice from `design.md`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept History API routing with focused, `tabindex=-1` page headings and a persistent polite route announcer. | `updates route focus, announcements, and metadata for navigation and Back`; live `live-recheck.json` records Privacy focus/announcement and Home focus/announcement after Back. |
| F-1-2 | Kept route-specific title, canonical, description, Open Graph, and Twitter metadata for Home, Demo, Privacy, and Terms. | Same route test; live Privacy title and canonical in `live-recheck.json`. |
| F-1-3 | Kept the `core-features-free` claim and test for free card/print/JSON and the visible $12 encrypted-backup price. | Clean-clone `@claim:core-features-free` pass; full 64-browser-test suite. |
| F-1-4 | Kept the explicit record-only safety boundary and `non-clinical-scope` test. | Clean-clone `@claim:non-clinical-scope` pass; print and editor checks in the tagged test. |
| F-1-5 | Kept the no-account/no-cloud-copy request and UI regression. | Clean-clone `@claim:no-account-or-cloud-copy` pass. |
| F-1-6 | Kept readable-JSON coverage and removed unprovable passphrase-recovery claims. | Clean-clone `@claim:plain-json-readable` and `@claim:encrypted-backup` passes. |
| F-1-7 | Kept the direct dialog focus-trap regression and removed the low-value payment-provider-ID claim. | Clean-clone `@claim:dialog-keyboard` pass. |
| F-1-8 | Kept concrete “Change history” and “Privacy” headings and the aligned card-owner terminology. | `copy-audit.md`; `shows required landing sections and product identity metadata`. |
| F-2-1 | Replaced the repeated demo masthead with a compact sample-card top: Evelyn Parker, confirmed date, Lisinopril, dose, timing, prescriber, and Edit are all visible before scrolling. The demo banner, Reset demo, Start for real, and `?demo=1` namespace remain intact. | `opens the completed sample card above the fold after one click` runs in desktop and 390×844 projects. Live `live-recheck.json` reports `withinViewport: true`; [live mobile screenshot](evidence/polish-2-live/demo-mobile.png). |
| F-2-2 | Expanded the designed static 404 with 404-specific description/canonical/OG/Twitter/favicons, skip link, compact product header, and footer Privacy/Terms links. | `ships a complete product shell and metadata on the designed 404`; release-config regression; live `live-recheck.json` records HTTP 404 and all required shell items; [live 404 screenshot](evidence/polish-2-live/not-found-mobile.png). |

## Verification evidence

- `CI=1 npm test`: **PASS** — 10 Vitest checks and 64 Playwright checks,
  including offline reload, privacy request logging, routing, dialog keyboard
  behavior, responsive 390 px layout, print/PDF, and axe checks.
- `npm run build`: **PASS** — `dist/index.html` produced; initial JavaScript is
  45.54 kB raw / 14.26 kB gzip and CSS is 20.49 kB raw / 5.28 kB gzip.
- Every one of the 15 literal commands in `claims.json` passed from its own
  fresh local clone at `/tmp/mhc-claims-3oY4Ib`; each clone’s
  `test-results/.last-run.json` reports `passed`.
- `verify-url.sh` live Home and `?demo=1`: HTTP 200, no console errors, one
  h1, `lang=en`, a main landmark, no missing image alt, and no unnamed buttons.
  Reports: [home](evidence/polish-2-live/verify-home/verify.json) and
  [demo](evidence/polish-2-live/verify-demo/verify.json).
- Live Playwright axe scan: no violations on Home, Demo, or the HTTP 404;
  [report](evidence/polish-2-live/axe-playwright.json). The standalone
  `@axe-core/cli` command cannot start its Selenium Chrome driver in this
  container; the repository’s Playwright axe integration and this live
  Playwright axe scan use the installed Playwright Chromium instead.
- Lighthouse mobile demo: Performance **100**, Accessibility **100**, LCP
  **1133.65 ms**, CLS **0**; [JSON report](evidence/polish-2-local/lighthouse-demo.json).

## Deployment and cold live recheck

Built `dist/` and deployed it through the work-order Static Web App resource
`sf-medication-handoff-card` in resource group `sociobot`; the deployment CLI
reported the production hostname `delightful-water-039582310.7.azurestaticapps.net`.
The custom production URL then served `index-Cgku02pB.js`, matching this build.

A new browser context opened the live custom domain cold. It found the demo
banner, Reset demo, Start for real, and the completed Lisinopril sample above
the 844 px mobile viewport. It then verified live Privacy focus/announcement
and Back behavior, and confirmed an unknown URL returns HTTP 404 with its own
metadata, favicon, header, and legal footer. The machine-readable result is
[live-recheck.json](evidence/polish-2-live/live-recheck.json).
