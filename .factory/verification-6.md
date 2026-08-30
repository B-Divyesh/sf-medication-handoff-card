# Independent verification 6 — Medication Handoff Card

**Result: PASS**

Verified on 2026-08-30 UTC against candidate commit
`5b5a5397790c031d19dd52e38cc1cae0eb1bb485` and the live deployment
<https://medication-handoff-card.sociobot.in>.

This was an independent read-only product QA pass. No product source was
changed. The only repository changes from this verification are this report
and the handoff status.

## Cold first read

Fresh live load at 1440 px returned 200 with no console or page errors. The
first screen says **“Make a clear medication handoff card.”**, identifies
“adult children, caregivers, and older adults” as the people it is for, and
places **“Try it with sample data”** beside “See a completed card for Evelyn
Parker.” It therefore answers what it does, who it is for, and what to click
first in plain words. The demo action is one click away and opens the isolated
sample card.

## Required claim checks — all passed

From the clean candidate checkout, I first ran `npm ci --ignore-scripts
--no-audit --no-fund`, then ran every command declared in
`.factory/claims.json` through the shipped Playwright demo entry point. The
sequential loop exited successfully. All 15 declared claims passed:

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

This covers the demo-storage boundary/reset, local-only normal record flow,
offline reload, plain and encrypted backups, the >20-entry history case,
one-page PDF output, keyboard dialog focus containment, real persistence,
390 px/reduced-motion/theme behavior, checkout, free core functions, and the
non-clinical scope.

## Local quality gates

- `CI=1 npm test`: **PASS** on the final clean rerun: 10 Vitest tests and 64
  Playwright tests; `test-results/.last-run.json` says `passed`.
- `npm run lint`: **PASS** (`tsc --noEmit`).
- `npm run build`: **PASS**. `dist/` was produced. Initial JS is 45.54 kB
  (14.26 kB gzip); CSS is 20.49 kB (5.28 kB gzip), both within the static-PWA
  budget.
- Live Lighthouse mobile (`/demo`): Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; LCP 987.06 ms, CLS 0, transfer 21,443 bytes.

One first full-suite attempt produced one mobile failure in the whitespace
validation/stop-medicine test. I preserved the failure trace, immediately
reran that exact mobile test successfully, then reran the full `CI=1 npm test`
suite successfully. It did not reproduce and did not affect any claim test;
see the P3 observation below.

## Live deployment and product exercise

- The deployed entry asset is `/assets/index-Cgku02pB.js`. Its SHA-256 is
  `1e95ae5adb40fed3073d91dcc1617754ffba2cffe9303c87bbc00d786fa9ca6f`,
  exactly matching the fresh candidate build. This confirms the live product
  is the candidate artifact.
- `verify-url.sh` passed for `/` and `/demo`: HTTP 200, title, `lang=en`, one
  h1, a main landmark, no missing image alt attributes, no unlabeled buttons,
  and no console/page errors. Its evidence is in
  `/tmp/mhc-verify-url/{home,demo}/verify.json` in the verifier environment.
- Independent live axe scans found no serious or critical violations on home,
  390 px demo, privacy, terms, or the real HTTP 404 page. Desktop and 390 px
  screenshots were visually inspected; the phone layout has no horizontal
  overflow (`scrollWidth` = 390), and task controls remain visible.
- Keyboard smoke check reached a visible designed focus indicator (solid
  3 px `rgb(20, 127, 152)` outline). The required dialog tab-loop claim also
  passed. Reduced-motion media was active and the mobile demo still fit at
  390 px.
- Normal demo use recorded only
  `https://medication-handoff-card.sociobot.in` requests (three same-origin
  app requests). No health-record request left the origin. The CSP only allows
  `self` plus the explicitly disclosed Sociobot billing origin in `connect-src`.
- Response headers on HTML, JS, service worker, and 404 include HSTS,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, a restrictive CSP,
  and Permissions-Policy. Hashed JS is cached for one year immutable; `sw.js`
  is `no-cache` for update discovery. The expected 404 navigation itself logs
  the browser’s HTTP-404 resource message; ordinary routes logged none.
- Service worker registration is live and controlling scope `/`. An explicit
  `registration.update()` retained an active worker with no stale waiting
  worker. After an online visit and controlled reload, a fresh context was
  set offline and `/demo` reloaded with HTTP 200, the Evelyn Parker card, and
  the offline banner.
- All documented site routes (`/`, `/demo`, `/privacy`, `/terms`, manifest,
  robots, sitemap, offline page, and 404 page) returned successfully. The
  checkout endpoint returned 303 to a Dodo checkout session.
- The optional Sociobot license verification endpoint was tested with a
  synthetic invalid token. Requests 1–30 returned 200; request 31 returned
  **429** with **`Retry-After: 3`**. Observed allowance: 30 verification
  requests per client window. No sign-in provider is present or required.

## Defects and observations

| Severity | Finding | Evidence / disposition |
| --- | --- | --- |
| P0–P2 | None found | All public claims, final full test run, build, live privacy/PWA/accessibility checks, and candidate/live identity checks passed. |
| P3 | One non-reproducible first-run e2e flake | The initial 64-test run failed the mobile whitespace-validation stop flow once. Its targeted rerun and a subsequent entire 64-test run passed. This is not a release blocker, but CI should watch this test for recurrence. |

## Re-run

```sh
npm ci --ignore-scripts --no-audit --no-fund
CI=1 npm test
npm run lint
npm run build
```

For the sample sandbox, open `https://medication-handoff-card.sociobot.in/demo`
or `/?demo=1`; use **Reset demo** and **Start for real** to verify the storage
boundary.
