# Independent verification 5 — PASS

**Candidate:** `14f00da0ac55b457eb508098996af0c1b6c56461`  
**Live URL:** <https://medication-handoff-card.sociobot.in>  
**Verified:** 2026-08-29 UTC  
**Scope:** clean candidate checkout, live PWA, desktop and 390 × 844 mobile

## Release decision

**PASS — candidate is releasable.** No P0, P1, or P2 defects were reproduced.
The live deployment is the candidate: fresh-build and deployed SHA-256 values
match for `index.html`, hashed JS, hashed CSS, `sw.js`, and the manifest.

## Mandatory cold-read and demo gate

**PASS.** A cold live desktop load says it makes “a clear medication handoff
card,” identifies “adult children, caregivers, and older adults” as the
audience, and offers the first action **Try it with sample data**, explained as
“See a completed card for Evelyn Parker.” The action loads the isolated sample
card and exposes the persistent **Demo — sample data, nothing is saved to your
real card** banner with **Reset demo** and **Start for real**.

## Claims contract

`.factory/claims.json` exists. Before broader inspection, I ran every literal
`test` command from it against the candidate checkout. Each command performed
its own `npm ci --ignore-scripts --no-audit --no-fund` and ran the tagged
Playwright test through the product demo entry point. All passed (desktop and
390 px mobile projects).

| Claim | Result |
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

## Functional and safety evidence

- The full local suite passed: **10 Vitest** checks and **60 Playwright**
  checks, including representative real-card creation/edit/confirmation across
  reload; whitespace-only invalid input and recovery; malformed-backup
  rejection; demo reset/isolation; plain and encrypted backup; and the
  one-page A4 print/PDF flow.
- A fresh live demo edit persisted its changed note and dated “Changed notes.”
  history entry. Its print DOM contained Lisinopril and the non-clinical safety
  statement; a live A4 PDF was exactly one page.
- The visible safety boundary is correct: no interaction or dose-recommendation
  control is presented, and the print handoff states that it is a communication
  record rather than medical advice.
- The live $12 checkout link returned **303** to a Dodo checkout session.
  Core card, print, and JSON backup remain usable without a license.

## Accessibility and responsive evidence

- `/`, `/demo`, `/privacy`, and `/terms` each had zero axe serious/critical
  findings. The dark, reduced-motion 390 px demo and open settings dialog also
  had zero such findings.
- The live page has `lang=en`, exactly one h1, a main landmark, title, image
  alternatives, labels, and no console/page errors. `/opt/fleet/lib/verify-url.sh`
  passed the normal live page.
- Keyboard: the first Tab reaches the skip link with a visible `3px` solid
  focus outline; 12 forward Tabs and a reverse Tab all remained inside the
  medicine dialog. At 390 px `scrollWidth` equalled `innerWidth` (390), and
  reduced-motion transition duration was `0.00001s`.

## Privacy, PWA, headers, and deployment

- A cold page and a live demo edit recorded only same-origin page requests:
  document, self-hosted JS, and self-hosted CSS. No health record, tracking,
  external font, or third-party request occurred. The optional license API is
  contacted only after a license action.
- Live headers include CSP (`connect-src 'self' https://api.sociobot.in`), HSTS,
  `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options:
  nosniff`, and Permissions-Policy. Hashed assets are one-year immutable;
  `sw.js` and the manifest are `no-cache`; manifest MIME is correct.
- A new live context installed and controlled `mhc-v6-shell` and
  `mhc-v6-runtime`; `registration.update()` completed with no waiting worker or
  error. After first visit, a fully offline `/demo` reload retained Evelyn
  Parker and displayed the Offline notice without errors.
- `/`, `/demo`, `/privacy`, and `/terms` returned 200; the designed unknown
  route returned 404. All internal links returned 200; source returned 200;
  checkout returned 303.
- The only product-associated server call is Sociobot license verification.
  Fresh invalid-token requests 1–30 returned 200; request 31 and later
  returned **429** with **`Retry-After: 4`**. Observed allowance: **30 requests
  per client window**.

## Quality gates and performance

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run test:unit
npm run lint
npm test
npm run build
```

All commands passed and build emitted `dist/`. Production JS is 44,460 bytes
raw / **13,920 bytes gzip** and CSS is 19,396 bytes raw / **5,114 bytes gzip**,
well within the static-PWA budgets.

Live mobile Lighthouse reported Performance **91**, Accessibility **100**, Best
Practices **100**, and SEO **100** (FCP 1.7 s, LCP 2.3 s, CLS 0). Lighthouse
reported a post-audit full-page-screenshot `TARGET_CRASHED` runtime artifact in
this container, but produced all category results; independent Playwright
desktop/mobile runs had no browser/page errors. This is recorded as a test
environment limitation, not a product defect.

## Defects by severity

None found.

## Evidence

Machine-readable live QA, screenshots, one-page PDF, Lighthouse report, and
`verify-url.sh` output are in
[`evidence/verification-5/`](evidence/verification-5/).
