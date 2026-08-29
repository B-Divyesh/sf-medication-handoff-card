# Independent verification 4 — FAIL

**Candidate:** `c2671fe2f3b81994589705a4b2ae7e510c97da5c`
**Live URL:** <https://medication-handoff-card.sociobot.in>
**Verified:** 2026-08-29 UTC
**Scope:** clean candidate clone, deployed static PWA, desktop and 390 × 844 mobile

## Release decision

**FAIL — do not release this candidate.** The live deployment is a byte-for-byte
match for the candidate build, so this is not a deployment-only failure. The
blocking findings below were independently reproduced on the deployed product.

## Mandatory first-read and demo gate

**PASS.** A cold desktop load answers all required questions in plain words:

- It makes a dated medication handoff card.
- It is for adult children, caregivers, and older adults sharing a checked list.
- The first action is **Try it with sample data**, with the result “See a
  completed card for Evelyn Parker.”

The action leads to the isolated sample card. Its persistent banner says the
sample is not saved to the real card and provides **Reset demo** and **Start
for real**.

## Claims contract

`.factory/claims.json` exists. Before any broader QA, every literal `test`
command was run in a fresh clone at the candidate commit. Each invoked its own
`npm ci --ignore-scripts --no-audit --no-fund` and its tagged Playwright test.
All passed in desktop and mobile projects (2 executions each).

| Claim | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `local-record` | PASS |
| `offline-reload` | PASS |
| `json-backup` | PASS |
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

The passing declared suite does not clear the unlisted-claim finding below.

## Release-blocking findings

### P1 — Whitespace-only required values persist an invalid medication

On a fresh live real card, entering three spaces into required medicine name,
dose, and timing fields made the browser form valid. Submission trims those
values to empty strings, stores the medication in IndexedDB, closes the
dialog, and displays:

> Something went wrong. Saved data on this device is incomplete. Restore a
> valid backup or reset this device’s card.

The stored record had empty `name`, `dose`, and `timing` fields. The recovery
choices are reload/reset rather than correcting the entry in the dialog. This
can corrupt the central handoff record. The same submit handlers trim, but do
not validate, a stop reason and confirmer name.

### P1 — License verification failure grants the paid feature

In a fresh live browser context, the exact verification request was answered
with a controlled `429 Retry-After: 4` response. Loading
`/demo?license=qa-new-license-with-no-verdict` stored the new token with no
cached verdict, displayed **Unlocked**, and exposed **Download encrypted
backup**. This contradicts the public claim that a *verified* one-time license
enables encrypted backup. The client treats a token without a parsed verdict as
unlocked on a verification error.

The real Sociobot endpoint itself correctly limited this client: requests 1–30
returned 200; request 31 and later returned `429` with `Retry-After: 4`.

### P2 — Explicit dark settings has a serious contrast violation

At 390 × 844, opening **Backup & settings**, choosing **Change light or dark
theme**, then running axe found one serious `color-contrast` violation:

- “One-time unlock · $12”: `#e37661` on `#2d353a`, contrast **4.17:1** at
  normal text size; the required ratio is 4.5:1.

### P2 — Public backup claim is absent from `.factory/claims.json`

When more than 20 changes exist, the product renders: “The 20 latest entries
are shown. **All history is included in backups.**” Source confirms that copy,
but no claim entry or sandbox test asserts full-history export beyond the
visible 20. The claims contract makes this release-blocking.

### P2 — Some 390px targets do not meet the 44 × 44 px baseline

Fresh mobile measurement found header **Try demo** at 41 × 44 px, footer
**Terms** at 41.5 × 44 px, and settings-dialog **Terms**/**Privacy** at
37.7 × 15 px and 46.3 × 15 px respectively.

## Passing functional, safety, and accessibility evidence

- A real live card successfully saved owner/caregiver, medicine name/dose/
  timing/prescriber, confirmation, and all values after reload.
- The demo saved an edit, **Reset demo** discarded it, and a JSON backup
  contained Evelyn Parker and all three sample medicines. Malformed JSON was
  rejected with an actionable status message. The sample prints to one A4 page
  containing the medicine list and non-clinical safety statement.
- The medicine dialog kept keyboard Tab focus inside it. The first Tab reaches
  a visible 3 px skip-link focus outline. The restore control also has a 3 px
  focus outline.
- At 390px in reduced-motion mode, the demo had no horizontal overflow and
  transition duration was `0.00001s`.
- Axe found zero serious/critical findings on live `/`, `/demo`, `/privacy`,
  and `/terms`, and also zero in system-dark demo. The explicit dark settings
  defect above is the exception.
- No console or page errors occurred during the exercised live flows.

## Privacy, PWA, deployment, and performance evidence

- The cold load and full demo edit/download/reset flow recorded only
  `https://medication-handoff-card.sociobot.in` page requests; no tracker,
  third-party font, or health-record request was observed. The optional
  billing API is only contacted after a license action.
- Browser responses provide CSP, HSTS, `Referrer-Policy`, `nosniff`, and
  `Permissions-Policy`. Hashed JS/CSS are one-year immutable; `sw.js` and the
  manifest are `no-cache`; manifest MIME is `application/manifest+json`.
- Live SHA-256 values exactly match the fresh candidate build for
  `index.html`, hashed JS, hashed CSS, `sw.js`, manifest, 404, and offline
  page. `/`, `/demo`, `/privacy`, `/terms`, and the internal links returned
  200; unknown route returned the designed 404; checkout returned 303 to a
  Dodo session.
- A fresh live demo installed `mhc-v5-shell`/`mhc-v5-runtime`; after the first
  visit, fully offline reload kept Evelyn Parker visible and showed the
  Offline notice. A controlled production-artifact worker version update
  displayed “A fresh version is ready. Reload when convenient.” with no
  browser errors.
- Mobile Lighthouse 13.4.1 on live `/demo`: Performance **98**,
  Accessibility **100**, Best Practices **100**, SEO **100**; FCP **0.9 s**,
  LCP **1.1 s**, CLS **0**, TBT **170 ms**, transfer **33 KiB**.

## Local quality gates

- `npm ci --ignore-scripts --no-audit --no-fund`: PASS (60 packages).
- `npm run lint`: PASS (`tsc --noEmit`).
- `npm test`: PASS — 8 Vitest tests and 52 Playwright tests.
- `npm run build`: PASS and produced `dist/`. JS is 41.61 kB raw / 13.33 kB
  gzip; CSS is 19.03 kB raw / 5.05 kB gzip.

## Evidence

Fresh machine-readable outputs and screenshots are in
[`evidence/verification-4/fresh/`](evidence/verification-4/fresh/), including
live functional/request logs, mobile accessibility measurements, link crawl,
candidate/live asset hashes, Lighthouse JSON, and screenshots.

## Required remediation

1. Validate trimmed required form values before any write; keep the dialog
   open with field-linked errors when the trimmed value is empty.
2. Treat a new token as locked until an explicit cached or newly fetched
   `valid: true` verdict exists. A 429/offline/error must not enable encrypted
   backup.
3. Raise the explicit-dark paid-eyebrow contrast to 4.5:1 or above, and add
   axe coverage with the settings dialog open after an in-app theme change.
4. Add a claims entry and >20-history export test for the full-history promise,
   or remove the promise. Expand every mobile interactive target to 44 × 44
   px or more.

This is a local-first static PWA with no application account, backend, CLI, or
library consumer API. The Sociobot license endpoints are its only server-side
product calls; their rate limit was verified above.
