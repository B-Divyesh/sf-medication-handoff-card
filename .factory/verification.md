# Independent verification — FAIL

**Candidate:** `67399cd635f62e9ead77f435211678763b95232f`  
**Live URL:** https://medication-handoff-card.sociobot.in  
**Verified:** 2026-08-29 UTC  
**Scope:** clean-checkout, deployed PWA, desktop and 390 px mobile

## Release decision

**FAIL. Do not release this candidate.** Two explicit acceptance gates fail before
the otherwise-solid core handoff workflow can be accepted.

### P0 — Required claims contract is missing

At the start of verification, before dependency installation or product tests,
the clean checkout's `.factory/` directory contained only `brief.json`,
`design.md`, and `handoff.md`. `.factory/claims.json` does not exist. Therefore
there were no declared claim tests to run through a demo entry point.

This is release-blocking by the supplied claims contract. It also leaves live
and README claims unregistered and unproven by the required one-test-per-claim
mechanism, including: “Stays on this device”, “Works offline”, local-only health
data, JSON export/restore, encryption, keyboard readiness, and the one-page
print/PDF card.

### P0 — No one-click isolated sample-data demo; first-read fails

Cold live-page observation at the URL above:

> “Keep the facts together when medicines change.”  
> “Record the current list, who checked it, and what changed—then hand family
> or clinicians a clear one-page card.”

The screen communicates a medication-list function, but does not plainly name
the intended adult-child/caregiver audience or present a clear first action in
the masthead. Most importantly, there is no visible **“Try it with sample
data”** action, no demo banner, no reset/start-for-real controls, and no
sample-data sandbox. `/demo` returns the ordinary empty application (`200`),
with zero matching sample-action or demo-banner elements and no local-storage
keys. `.factory/demo.md` is also absent.

This independently fails the mandatory first-read and demo-sandbox gates.

## Other defects

### P1 — No enforced Content-Security-Policy response header

Live responses for `/`, `/privacy`, `/terms`, `/sw.js`, and the hashed JS/CSS
contain HSTS, Referrer-Policy, and X-Content-Type-Options but no
`Content-Security-Policy`. Lighthouse records “No CSP found in enforcement
mode.” This violates the site-structure security-header requirement for a
product holding sensitive local health records.

### P2 — Titles do not meet the route-title contract

The home page title is exactly `Medication Handoff Card`, not the required
“Product name — what it does in plain words” form. `/demo` also uses that same
title rather than `Demo — Medication Handoff Card` (and is not a demo).

### P2 — Missing real 404 and immutable asset cache policy

`/no-such-page` responds `200` with the application shell rather than a
designed real 404. Live hashed JS/CSS and PWA files use `cache-control: public,
must-revalidate, max-age=30`, not a long-lived `immutable` policy required for
hashed static assets. The manifest is served as `application/octet-stream`,
not `application/manifest+json`.

### P2 — Modal tab sequence briefly loses dialog focus

In the add-medicine native dialog at 390 px, focus begins in the dialog and
visits each labelled input and action with the designed 3 px focus ring. After
the final Cancel button, one Tab lands on `body` before returning to the dialog.
This is not an axe serious finding, but it is a dialog focus-management gap.

## Evidence: passing checks

- `npm ci` completed from the clean candidate with 0 reported vulnerabilities.
- `npm test` passed: 2 Vitest tests and 10 Playwright tests across desktop and
  mobile. (No test is claim-tagged, because the required claims file is absent.)
- Exact production command `npm run build` passed. Output: JS 32.22 kB
  (10.52 kB gzip), CSS 16.60 kB (4.60 kB gzip); below the 200 kB/50 kB budgets.
- Deployed `/`, `sw.js`, `assets/index-Djo4H1t-.js`, and
  `assets/index-BRlxyC15.css` are byte-for-byte identical to this candidate's
  fresh `dist/` build (matching SHA-256 and `cmp`). This is not a deployment
  drift failure.
- Fresh live normal flow passed: saved owner/keeper; added Lisinopril 10 mg;
  edited to 20 mg; confirmed by Maya Bennett; downloaded a valid JSON backup
  (1 medicine, 3 changes); rejected an invalid backup with a useful recovery
  message; restored the valid backup. No page or console errors occurred.
- Live request log during that normal flow contained only same-origin document,
  JS, CSS, and image requests. The public record stayed in IndexedDB; there
  were no analytics, tracking, font-CDN, or third-party requests. The optional
  license check was not invoked in that flow. Its documented Sociobot endpoint
  rate-limited this client after 30 requests: request 31 returned
  `429 Retry-After: 4`.
- Axe 4.10 / Playwright found zero serious or critical findings on live home at
  desktop and 390 px, Privacy, and Terms. Keyboard smoke checks found the
  visible skip-link focus ring (3 px) and 44 px+ target. No mobile horizontal
  overflow occurred (390 px document width).
- PWA: after first visit the live app had an active controller and
  `mhc-v2-shell`/runtime caches. With the context offline it reloaded its saved
  app and showed the offline banner. A local production-build update simulation
  installed `mhc-v3-shell`, claimed the client, and displayed “A fresh version
  is ready. Reload when convenient.”
- Print media/PDF smoke test included Lisinopril and the non-medical safety
  note in the generated handoff card.
- Lighthouse mobile: Performance 94, Accessibility 100, Best Practices 100,
  SEO 100; FCP 1.0 s, LCP 1.4 s, CLS 0, transfer 104 KiB.

## Required remediation before another verification

1. Add `.factory/claims.json`, one observable demo-entry test tagged per
   claim, and run every listed command from a clean clone.
2. Build `/demo` (or `?demo=1`) with realistic sample medications, an isolated
   `demo:` storage namespace, persistent banner, Reset demo, Start for real,
   and `.factory/demo.md`. Put “Try it with sample data” on the first screen.
3. Rewrite the first screen so it names adult children/caregivers, the handoff
   result, and the first click in plain words.
4. Add an enforced restrictive CSP and deployment configuration for immutable
   hashed asset caching, manifest MIME type, and a genuine 404 response.
5. Correct the page titles and retain focus inside open dialogs.
