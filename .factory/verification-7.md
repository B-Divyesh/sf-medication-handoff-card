# Independent verification 7 — Medication Handoff Card

**Result: PASS**

Verified on 2026-08-30 UTC against candidate commit
`9a11a6f2ec5dac7e4ef502d1be6e9ca2aaca85d2` and the live deployment
<https://medication-handoff-card.sociobot.in>.

This was an independent QA pass. Product source was not modified; this report
and the handoff update are the only intended repository changes.

## First read and demo gate

A fresh 390 × 844 Chromium context opened the live home page cold (HTTP 200,
no ordinary-route console or page errors). Its first screen says **“Make a
clear medication handoff card.”**, names **“adult children, caregivers, and
older adults”** sharing a checked list with family or clinicians, and presents
**“Try it with sample data”** with **“See a completed card for Evelyn Parker.”**
The first screen therefore states what it does, for whom, and what to do first
in plain language. One click opened the populated demo and its persistent
“Demo — sample data, nothing is saved” banner with Reset demo and Start for
real controls.

## Mandatory claim gate — PASS (15/15)

From this clean candidate checkout, I ran `npm ci --ignore-scripts --no-audit
--no-fund` and every `test` command declared in `.factory/claims.json`, using
the shipped demo entry point. Each command passed in both configured Playwright
projects (desktop and mobile):

| Claim id | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `local-record` | PASS |
| `offline-reload` | PASS |
| `json-backup` | PASS |
| `full-history-backup` | PASS |
| `print-card` | PASS |
| `dialog-keyboard` | PASS |
| `encrypted-backup` | PASS |
| `record-workflow` | PASS |
| `adaptive-interface` | PASS |
| `checkout-available` | PASS |
| `core-features-free` | PASS |
| `non-clinical-scope` | PASS |
| `no-account-or-cloud-copy` | PASS |
| `plain-json-readable` | PASS |

This covers isolated/resettable sample storage, same-origin privacy logging,
offline reload, backup/restore and complete history, one-page PDF output,
keyboard dialog containment, persistence, 390 px/reduced-motion/theme support,
checkout/licensing, free core features, and the non-clinical boundary.

## Clean local quality gates

- `CI=1 npm test`: **PASS** — 10 Vitest tests and 68 Playwright tests.
- `npm run lint`: **PASS** (`tsc --noEmit`).
- `npm run build`: **PASS**, producing `dist/` at its artifact root.
- Production bundle: JS 45.92 kB raw / 14.31 kB gzip; CSS 20.49 kB raw /
  5.28 kB gzip. Both are within the static-PWA budgets.

## Live production verification

- Deployment identity: live `/assets/index-DyRqq8DO.js` SHA-256 was
  `1c4f90e0eeaaadd9ca977e614fe4cfb3d1bf8f77d2fdeeb9d6ac01a1082652fb`,
  exactly matching the fresh candidate build. The CSS filename and SHA-256
  (`16cfe13ef83d4f2e46d4ce1323587071889d108d4ff40c7867a36ea32bfe09aa`)
  also matched.
- Independent demo exercise: whitespace-only required medicine fields were
  rejected with field errors; corrected values saved “Example medication”; the
  four-item list was confirmed; the JSON download contained all four medicines
  and four history entries; Reset demo discarded the edit. The print renderer
  generated a 34,534-byte A4 PDF. Claim tests separately assert exactly one
  page and visible safety content.
- Accessibility: live axe scans found **zero serious/critical violations** on
  home, dark demo, Privacy, Terms, and the real 404 page. Each has `lang=en`,
  one h1, and one main landmark. Keyboard testing found a designed solid 3 px
  focus outline and retained Tab focus inside the medicine dialog.
- Mobile and motion: 390 px demo has no horizontal overflow; under
  `prefers-reduced-motion: reduce`, animation and transition durations are
  `0.00001s` while the interface remains usable.
- Privacy: a full live demo edit/export flow made three requests, all to
  `https://medication-handoff-card.sociobot.in`; no health record went to a
  third party. No account, sign-in, sync, or non-Entra identity provider is
  present (sign-in is not required by this local-first product).
- PWA: a fresh context had an active controlling service worker at `/sw.js`.
  `registration.update()` completed with no stale waiting worker. After first
  load, `/demo` reloaded offline with Evelyn Parker’s card and the offline
  status banner. `sw.js` uses versioned caches, `skipWaiting`, and
  `clients.claim`.
- Headers/caching: HTML, JS, service worker, manifest, and 404 responses carry
  CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and
  Permissions-Policy. The hashed JS has `public, max-age=31536000, immutable`;
  `sw.js` and the manifest are `no-cache`; the manifest has the correct
  `application/manifest+json` type. Unknown routes return HTTP 404 with the
  designed page. Chrome reports the expected failed-resource console message
  for the intentional 404 navigation itself; normal routes had no errors.
- Live mobile Lighthouse (`/demo`): Performance **99**, Accessibility **100**,
  Best Practices **100**, SEO **100**; FCP 904 ms, LCP 1,071 ms, CLS 0, TBT
  134 ms, transfer 35,021 bytes.
- Routes `/`, `/demo`, `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml`, and
  the manifest returned 200; the checkout endpoint reached a Dodo checkout
  session.

## Server/API allowance

The static product has no application-owned backend. Its documented Sociobot
license-verification endpoint was nevertheless checked as required: one client
received 200 for requests 1–30 to
`/api/v1/products/medication-handoff-card/verify`; request 31 received
**429 Too Many Requests** with **`Retry-After: 3`**. Observed allowance: **30
requests per client window**.

## Defects

| Severity | Finding |
| --- | --- |
| P0 | None |
| P1 | None |
| P2 | None |
| P3 | None |

## Re-run

```sh
npm ci --ignore-scripts --no-audit --no-fund
CI=1 npm test
npm run lint
npm run build
```

Use <https://medication-handoff-card.sociobot.in/demo> for the isolated sample
card. Reset demo to discard sample edits; Start for real opens the separate
empty local card.
