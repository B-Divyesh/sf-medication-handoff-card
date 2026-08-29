# Independent verification 3 — PASS

**Candidate:** `cbeeb7363fa3cacd867dd3e0eef34f06918df805`  
**Live URL:** <https://medication-handoff-card.sociobot.in>  
**Verified:** 2026-08-29 UTC  
**Scope:** clean candidate, deployed static PWA, desktop and 390 × 844 mobile

## Release decision

**PASS.** The deployed application is the tested candidate and meets the researched
brief's local-first medication-handoff job. No release-blocking defects were found.

### Mandatory first read and demo

Cold live load plainly answered all required questions on the first screen:

- **What:** “Make a clear medication handoff card.”
- **For whom:** adult children, caregivers, and older adults sharing a checked
  list with family or clinicians.
- **First action:** **Try it with sample data**, with the result stated as a
  completed Evelyn Parker card.

That action and direct `/demo` load a realistic three-medicine card in the
separate `demo:medication-handoff-card` IndexedDB database. The persistent
banner says the sample is not saved to the real card and includes **Reset demo**
and **Start for real**. Independent isolation testing preserved an existing
real-card owner while entering and leaving demo; reset restored the original
sample and exit discarded its edits.

## Required claims contract

`.factory/claims.json` is present. Before broader QA, every listed **literal**
self-installing command was run from this checkout. Each installed 60 packages
with `npm ci --ignore-scripts --no-audit --no-fund` and passed in both configured
browser projects (desktop and 390 px mobile).

| Claim | Result |
| --- | --- |
| `demo-isolation` | PASS, 2/2 |
| `local-record` | PASS, 2/2 |
| `offline-reload` | PASS, 2/2 |
| `json-backup` | PASS, 2/2 |
| `print-card` | PASS, 2/2 |
| `dialog-keyboard` | PASS, 2/2 |
| `encrypted-backup` | PASS, 2/2 |
| `record-workflow` | PASS, 2/2 |
| `adaptive-interface` | PASS, 2/2 |
| `checkout-available` | PASS, 2/2 |

## Clean build and product workflow

- `npm test` passed: Vitest **8/8** and Playwright **42/42**.
- `npm run test:unit` passed: **8/8**.
- `npm run lint` passed (`tsc --noEmit`).
- Exact production `npm run build` passed and produced `dist/`. Main JS is
  **39.24 kB raw / 12.62 kB gzip** and CSS **19.03 kB raw / 5.05 kB gzip**;
  both are inside the static-product budgets.
- A fresh real-card flow saved Ruth Bennett/Maya Bennett, rejected an empty
  required medicine field, added Lisinopril 10 mg, edited it to 20 mg,
  confirmed the list, and persisted owner, medicine, and three dated changes
  after reload. There were no page or console errors.
- JSON export produced a one-medicine/three-change backup. Malformed JSON was
  rejected with “Choose a Medication Handoff Card … backup” recovery guidance
  without replacing data; a valid JSON backup restored and survived reload.
- The representative card generated an A4 PDF with **exactly one page** and
  the non-medical safety note.

## Accessibility, responsive behavior, and visual review

- Visual inspection of a cold 1440 px page and a populated dark 390 px demo
  found the product-specific paper/kitchen-table visual system legible and
  coherent; there was no horizontal overflow.
- Keyboard-only checks: the first Tab reaches the visibly focused skip link;
  16 forward Tabs stayed inside the open medicine dialog. The native required
  validation is labelled and usable.
- At 390 px, maximum allowed unbroken medicine, dose, timing, prescriber, and
  note values wrapped without horizontal scrolling. Reduced motion computed to
  `0.00001s`; the in-app dark theme switched correctly.
- Axe 4.10.2 found **zero serious or critical violations** on live `/`,
  `/privacy`, `/terms`, and populated dark `/demo`.

## Privacy, PWA, security, and deployment

- Playwright request logging over demo edit and real-card workflows recorded
  only `https://medication-handoff-card.sociobot.in`; no analytics, trackers,
  font CDN, or health-data request was made. The optional license call was not
  made during those flows.
- Live response headers enforce CSP (`default-src 'self'`; Sociobot only in
  `connect-src`), HSTS, Referrer-Policy, X-Content-Type-Options, and
  Permissions-Policy. Hashed JS/CSS are one-year `immutable`; manifest and
  worker are `no-cache`; manifest MIME type is `application/manifest+json`.
- `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown path returns
  the designed **404**. All collected internal links returned 200; checkout
  returned **303** to a Dodo session; the declared external source returned
  200.
- Offline: after a first live demo visit, an active controller and
  `mhc-v4-shell`/`mhc-v4-runtime` caches were present. A fully offline reload
  kept Evelyn Parker visible and showed the Offline banner, with no errors.
- Update: a local production-artifact worker-update simulation installed a new
  cache, changed controller, and displayed “A fresh version is ready. Reload
  when convenient.” The real worker uses versioned caches, `skipWaiting`, and
  `clients.claim`.
- Candidate/deployment identity: SHA-256 and byte comparison matched live
  `index.html`, hashed JS, hashed CSS, `sw.js`, manifest, and `404.html` to the
  fresh candidate build.
- The only server-side product endpoint is optional Sociobot license handling.
  Its observed allowance was **30 invalid verification requests per client
  window**: requests 1–30 returned 200; request 31 and later returned **429**
  with `Retry-After: 4`.

## Performance

Live mobile Lighthouse 13.4.1 (screenshot collection disabled after an initial
browser-only screenshot crash) completed cleanly: **Performance 99,
Accessibility 100, Best Practices 100, SEO 100**; FCP **1355 ms**, LCP
**1696 ms**, CLS **0**, TBT **121 ms**, and transfer **110,354 bytes**.

## Defects by severity

None found: **P0 0, P1 0, P2 0, P3 0.**

## Not applicable

This is a static local-first PWA: no account/sign-in flow, application backend,
CLI, or library package exists. No Microsoft Entra or backend concurrency test
therefore applies.
