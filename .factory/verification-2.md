# Independent verification 2 — FAIL

**Candidate:** `fcb4129dfb965e57c19d413c02d947f1459461f5`  
**Live URL:** https://medication-handoff-card.sociobot.in  
**Verified:** 2026-08-29 UTC  
**Scope:** clean checkout, deployed PWA, desktop and 390 × 844 mobile

## Release decision

**FAIL. Do not release this candidate.** The live deployment matches the
candidate, so this is not the previously reported deployment-drift failure.
The candidate has release-blocking claim coverage gaps, a dead paid checkout,
a persistent-data corruption path, and serious dark-theme contrast failures.

## Mandatory first-read and demo gate

**Pass.** A cold 1440 × 900 visit showed:

- What it does: “Make a clear medication handoff card.”
- Who it is for: “For adult children, caregivers, and older adults sharing a
  checked list with family or clinicians.”
- What to click first: **Try it with sample data**, followed by “See a completed
  card for Evelyn Parker.”

The one-click action opened `/demo` with Evelyn Parker, three realistic
medicines, a persistent demo banner, Reset demo, and Start for real. A direct
fresh `/demo` visit opened only the `demo:medication-handoff-card` IndexedDB
database. The real card remained empty after leaving the demo.

## Release-blocking findings

### P0 — The claims contract is not fully proved

The required first invocation of all seven exact `.factory/claims.json`
commands, before dependency installation, failed with
`ERR_MODULE_NOT_FOUND: @playwright/test`. After `npm ci`, every command passed
on both projects (2/2 tests per command). The prepared results were:

| Claim | Prepared result |
| --- | --- |
| `demo-isolation` | PASS, 2/2 |
| `local-record` | PASS, 2/2 |
| `offline-reload` | PASS, 2/2 |
| `json-backup` | PASS, 2/2 |
| `print-card` | PASS, 2/2 |
| `dialog-keyboard` | PASS, 2/2 |
| `encrypted-backup` | PASS, 2/2 |

Even discounting the missing-dependency setup failure, two listed claims are
not tested to the contract's observable-outcome standard:

- `print-card` promises a **one-page** print/PDF card, but its tagged test only
  switches to print media and checks text. It never creates a PDF or asserts a
  one-page result. An independent sample PDF was one page, but the required
  regression does not prove the public claim.
- `demo-isolation` clicks Reset demo without changing the sample first, so it
  cannot prove that reset restores modified demo data. Independent testing
  confirmed the implementation does reset, but the claim test is ineffective.

README claims for light/dark themes, reduced-motion behavior, and responsive
layouts “down to 390 px and below” have no corresponding claims in
`.factory/claims.json`. The claims contract explicitly makes unlisted claims a
failed review.

### P1 — The advertised $12 purchase cannot be made

The visible **Unlock encrypted backups — $12** link targets the documented URL,
but the live endpoint responds `404` and does not redirect to checkout:

`https://api.sociobot.in/api/v1/products/medication-handoff-card/checkout`

License verification itself works: an invalid token returned `200` with
`valid: false`, and the UI stayed locked with “License no longer active.” The
purchase entry point is nevertheless unavailable end to end.

### P1 — A malformed backup can permanently break the local card

A JSON file with the advertised format/version and
`profile: {"id":"profile"}` passes `validBackup`, is accepted after the replace
confirmation, and is persisted. On reload, the app throws
`Cannot read properties of undefined (reading 'replace')` and remains on
“Opening your private medication card…”. There is no in-product recovery; the
user must clear site data. This is a high-impact failure for a health record
whose restore flow says it accepts a valid backup.

### P1 — Dark demo has serious axe contrast failures

Axe 4.10.2 on `/demo` at 390 × 844 in dark mode reports five serious
`color-contrast` nodes:

- Demo banner text, bold text, Reset demo, and Start for real: `#fffdf8` on
  `#80bba2`, ratio **2.16:1** (required 4.5:1).
- Confirm current list: `#fff` on `#80bba2`, ratio **2.19:1** (required 4.5:1).

Light-mode `/`, `/demo`, `/privacy`, and `/terms` had no axe violations in a
fresh rerun. The shipped axe test never checks the populated demo in dark mode.

## Other defects

### P2 — The deployed “real 404” still responds with the app and HTTP 200

`/definitely-missing-qa-page` returns `200` and the ordinary app shell. The
candidate's `404.html` exists and byte-matches the deployed file, but the
navigation fallback prevents the platform 404 override from being used.

### P2 — Leaving demo mode does not discard demo changes

After editing Lisinopril's sample note, selecting Start for real correctly
opened an empty real card. Opening `/demo` again restored the edited note from
`demo:medication-handoff-card`. The supplied demo-sandbox contract requires
demo data to be discarded on exit (or explicitly offered for transfer).

### P2 — Keyboard focus and touch-size requirements are incomplete

- The hidden Restore a backup file input can receive keyboard focus, but it is
  `opacity: 0` and only 27.58 × 47.28 px. Its 3 px outline is therefore not
  visible, and the styled label has no `:focus-within` treatment.
- At 390 px, the Try demo and Privacy header links are about 20.3 px high;
  footer Privacy, Terms, and Source links are about 21.8 px high. These miss the
  required 44 × 44 px touch targets.

The skip link itself is first in the tab order with a visible 3 px outline.
Medicine-dialog focus loops forward and backward, Escape closes it, and focus
returns to the invoking Edit button.

### P2 — Valid maximum-length text can destroy the mobile layout

At 390 px, valid maximum-length unbroken values (120-character medicine name,
80-character dose, 120-character timing/prescriber, and 300-character note)
saved successfully but expanded `documentElement.scrollWidth` to **3332 px**.
The inputs enforce their declared maximums, but rendered user content lacks a
safe wrapping rule.

### P2 — Blocking service workers produces an uncaught load error

With Playwright's service-worker policy set to `block`, the main UI remains
usable but load emits `Cannot read properties of undefined (reading
'waiting')`. Normal service-worker-enabled cold loads had no console or page
errors. Registration failure should degrade quietly for restricted browsers.

### P3 — Invalid JSON exposes a parser error instead of a recovery instruction

Uploading `not valid json` preserves the existing card, but displays the raw
message `Unexpected token 'o', "not valid json" is not valid JSON`. It does not
say what file is accepted or what the user should do next.

### P3 — Mandatory landing structure and social metadata are incomplete

The landing page embeds the product successfully but has no “How it works”
three-step section or visible paid-tier section, and its first-screen facts do
not state the price. The Open Graph image is the 1280 × 853 hero rather than a
purpose-built 1200 × 630 image; the favicon/apple-touch setup also lacks the
specified SVG favicon and 180 px apple-touch asset.

## Passing evidence

- `npm ci`: passed, 60 packages installed, 0 vulnerabilities.
- `npm run lint`: passed (`tsc --noEmit`).
- `npm run test:unit`: 4/4 passed.
- `npm test`: 4 unit/config tests and 26 Playwright tests passed across desktop
  and exact 390 × 844 mobile.
- `npm run build`: passed and produced `dist/`. Main JS is 35.65 KB raw / 11.57
  KB gzip; CSS is 17.42 KB raw / 4.75 KB gzip. The 640 px hero is 21.78 KB.
- Fresh live normal flow passed owner/keeper save, required-field validation,
  add, edit, confirm, JSON export, stop/remove, persistence, and history.
- Demo and real normal flows made only same-origin requests. No analytics,
  tracker, external font, or health-data request was observed. Invalid-license
  verification sent only the token to `api.sociobot.in` as documented.
- The API allowance is **30 verification requests per client window**. Request
  31 returned `429` with `Retry-After: 4`.
- Live response headers include an enforced restrictive CSP, HSTS,
  Referrer-Policy, X-Content-Type-Options, and Permissions-Policy. Hashed JS/CSS
  use one-year immutable caching; the service worker and manifest use
  `no-cache`; the manifest MIME type is correct.
- Live `index.html`, hashed JS, hashed CSS, `sw.js`, manifest, and `404.html`
  are byte-for-byte SHA-256 matches to this candidate's fresh `dist/` build.
- Live PWA offline reload passed with Evelyn Parker's data and the Offline
  banner. Active caches were `mhc-v3-shell` and `mhc-v3-runtime`.
- A local candidate update simulation installed `mhc-v4-shell`, claimed the
  controlled page, and showed “A fresh version is ready. Reload when
  convenient.”
- The representative three-medicine demo generated a one-page A4 PDF containing
  the current list, change history, confirmation, and non-medical warning.
- Reduced motion computed to 0.01 ms for button transitions and dialog
  animation. No 390 px horizontal overflow occurred with representative demo
  data.
- `/opt/fleet/lib/verify-url.sh` passed the normal live page: title, `lang=en`,
  one h1, main landmark, image alt text, labelled buttons, and no normal-load
  console errors.
- Clean Lighthouse mobile rerun: Performance 100, FCP 0.9 s, LCP 1.4 s, CLS 0,
  TBT 60 ms, and 106 KiB transfer. A separate full-category run scored
  Accessibility 100, Best Practices 100, and SEO 100 on the light empty home
  page; that audit does not cover the dark populated-demo contrast defect.

No sign-in, application backend, library package, or CLI is present, so the
corresponding identity, concurrency, consumer-install, and CLI checks do not
apply.

## Required remediation

1. Make every claim test executable in the mandated clean-clone sequence;
   strengthen the print and reset tests; list and test or remove every README
   claim.
2. Register/fix the Sociobot checkout product and prove the live redirect.
3. Deeply validate imported profiles, medicines, and history before replacing
   IndexedDB; reject malformed backups without changing the current record.
4. Fix and retest all dark-theme contrast violations.
5. Make unknown URLs return the designed 404 with a real 404 status.
6. Discard demo changes on exit; add visible focus for restore; enlarge touch
   targets; wrap long user content; and handle service-worker failure quietly.
