# Adversarial first-read review 2 — FAIL

**Reviewed:** 2026-08-29 UTC  
**Live URL:** <https://medication-handoff-card.sociobot.in>  
**Viewports:** fresh Chromium contexts at 390 × 844 and 1440 × 1000

## Verdict

**FAIL.** The landing page explains the product, audience, and first action
clearly. The sample is isolated, resettable, and functional. However, the
required one-click demo does not show the completed sample card on its first
screen at either required viewport. The designed 404 also omits required
route metadata and the consistent site header/footer. Acceptance requires zero
findings.

## Findings

### F-2-1 — BLOCKING: Demo enters on a repeated landing hero, not a visible completed sample card

**Location:** live `/demo` and `/?demo=1`; `src/main.ts` `appPage()`.

The landing action correctly opens the isolated demo in one click. Its banner
says:

> “Demo — sample data, nothing is saved to your real card. Try editing Evelyn
> Parker’s example list.”

But the first 390 × 844 screen contains the banner and the repeated headline,
facts, and safety note; it shows neither Evelyn Parker nor a medicine. In the
live page, the owner panel begins at y=1,146 and the first sample medicine
(Lisinopril) at y=1,573. On desktop, the first medicine begins at y=1,012 in
a 1,000 px viewport. The visitor must scroll before seeing the promised
completed example. This fails the demo requirement that the first screen after
clicking already show the product in use with realistic sample data.

**Fix:** Give `/demo` a compact, demo-specific top section: retain the
persistent banner, then put “Evelyn Parker” and at least Lisinopril with dose,
timing, and Edit control above the fold at 390 px. Do not repeat the full
marketing masthead before the sample. Add a Playwright regression at 390 × 844
and desktop that opens the landing action, then asserts a sample medicine’s
bounding box is within `window.innerHeight` without scrolling.

### F-2-2 — P2: The designed 404 is outside the product’s metadata and navigation skeleton

**Location:** live unknown URL and `public/404.html:4-8`.

The unknown route returns a real 404 and has a useful return link, but its DOM
has no meta description, canonical link, Open Graph/Twitter metadata, favicon
link, product header, footer, Privacy link, or Terms link. The observed live
DOM contained only the title, viewport/robots metadata, stylesheet, one h1,
and “Return to your card.” This breaks the stated requirement for route
metadata and a consistent header/footer with Privacy and Terms.

**Fix:** Add the product favicon and 404-specific description/canonical/social
metadata to `404.html`, and render the same compact wordmark/header and footer
used elsewhere, including Privacy and Terms. Keep its existing plain h1 and
return-home action. Add a browser check for these elements on an HTTP 404.

## Cold first read

**PASS.** Before scrolling, both fresh viewports answered all three questions.

| Question | Cold visitor answer | Evidence |
| --- | --- | --- |
| What does this do? | Makes a clear medication handoff card. | “Make a clear medication handoff card.” |
| For whom? | Adult children, caregivers, and older adults sharing a checked list with family or clinicians. | The sentence directly below the h1. |
| What should I click first? | Try the completed Evelyn Parker example. | “Try it with sample data” and “See a completed card for Evelyn Parker.” |

The primary action is visible and usable at 390 px. There were no console
errors on the live home screen. This does not clear F-2-1: the failure occurs
after that action is taken.

## Demo, sandbox, and privacy behaviour

The demo entry is one click and uses realistic sample data: Evelyn Parker,
Lisinopril, Metformin ER, Vitamin D3, confirmation details, and history. The
banner is persistent and has **Reset demo** and **Start for real**. Editing
Lisinopril’s note to “Temporary review edit.” then choosing Reset restored
“Take as listed on the pharmacy label.” Starting for real opened `/` with zero
medicines. The captured demo-edit request list contained only same-origin
document, JS, CSS, and image URLs.

The implementation selects `demo:medication-handoff-card` before reading the
app database; normal use selects `medication-handoff-card`. The
`demo-isolation`, `local-record`, and `offline-reload` claim tests additionally
cover namespace isolation, same-origin requests, and offline reload. The
isolation behaviour passes; F-2-1 is solely an above-the-fold demo-value
failure.

## Claims contract

I read `.factory/claims.json` and ran every literal listed command with its
own `npm ci --ignore-scripts --no-audit --no-fund` in this sandbox. All passed
in the desktop and 390 px Playwright projects.

| Claim ID | Result |
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

`CI=1 npm test` passed (10 Vitest and 60 Playwright tests), and `npm run
build` passed and produced `dist/index.html`. The production bundle reports
44.46 kB raw / 14.05 kB gzip JavaScript and 19.40 kB raw / 5.10 kB gzip CSS.

Every claim-like landing/README statement maps to a current claim entry:
local-only storage and no account/cloud copy; offline operation; free core and
$12 encrypted backup; print/PDF; full history; non-clinical scope; readable
JSON; demo isolation; adaptive layout; dialog focus; and checkout. No
unlisted claim finding was found.

## Copy audit

Counts treat hyphenated words, product names, and numbers as one word. The
tables list every prose sentence on the landing experience and README; labels,
headings, and controls are listed separately because they are user-facing
copy. No prose sentence exceeds 22 words. No banned marketing adjective,
jargon-led promise, inconsistent term, abstract heading, or non-result-naming
button was found.

### Landing prose

| Sentence | Words | Result |
| --- | ---: | --- |
| A dated list for the next handoff | 7 | Pass |
| Make a clear medication handoff card. | 6 | Pass |
| For adult children, caregivers, and older adults sharing a checked list with family or clinicians. | 14 | Pass |
| See a completed card for Evelyn Parker. | 7 | Pass |
| Records stay in this browser. | 5 | Listed: `local-record` |
| Works offline after the first visit. | 7 | Listed: `offline-reload` |
| Card, print, and JSON backup are free; encrypted backups cost $12 once. | 12 | Listed: `core-features-free` |
| Communication tool, not medical advice. | 5 | Listed: `non-clinical-scope` |
| No interaction checks or dose recommendations. | 6 | Listed: `non-clinical-scope` |
| Confirm every change with a qualified clinician or pharmacist. | 9 | Useful safety instruction |
| You, a relative, or the card owner | 7 | Helpful field guidance |
| Add exactly what is written on the label. | 8 | Useful instruction |
| This tool records what you enter; it does not check whether a medicine or dose is right. | 17 | Listed: `non-clinical-scope` |
| Changes will appear here automatically when you add, edit, or stop a medicine. | 13 | Listed: `record-workflow` |
| The 20 latest entries are shown. | 6 | Listed: `full-history-backup` |
| All history is included in backups. | 6 | Listed: `full-history-backup` |
| Copy each medicine, dose, timing, and prescriber from a trusted source. | 11 | Useful instruction |
| Confirm the current list and keep dated changes. | 8 | Listed: `record-workflow` |
| Print one page or download a JSON backup. | 8 | Listed: `print-card`, `json-backup` |
| There is no health-data account or cloud copy. | 8 | Listed: `no-account-or-cloud-copy` |
| You choose when to print or download a backup. | 9 | Useful description |
| Encrypted backup is the only paid feature. | 6 | Listed: `core-features-free` |
| The card, print view, and plain JSON backup are free. | 10 | Listed: `core-features-free` |
| Your health record stays in this browser during normal use. | 10 | Listed: `local-record` |
| Scene generated for this product; no person or brand is depicted. | 11 | Useful provenance |
| Offline: your card still works and saves on this device. | 9 | Listed: `offline-reload`, `local-record` |
| Demo — sample data, nothing is saved to your real card. | 10 | Listed: `demo-isolation` |
| Try editing Evelyn Parker’s example list. | 6 | Clear demo instruction |
| This sample is separate from your own card. | 8 | Listed: `demo-isolation` |
| Reset it any time. | 4 | Clear demo instruction |
| It will leave the current list, but this change stays in history. | 12 | Listed: `record-workflow` |
| Only confirm after checking every medicine, dose, and timing against a reliable source. | 12 | Useful safety instruction |
| I checked all current medicines. | 5 | Clear confirmation control; dynamic count omitted |
| Backups include the card owner, current medicines, and full change history. | 10 | Listed: `full-history-backup` |
| Plain JSON is readable and portable. | 6 | Listed: `plain-json-readable` |
| Choose only a Medication Handoff Card .json or .mhc backup. | 9 | Clear import guidance |
| Protect a backup with a passphrase. | 7 | Listed: `encrypted-backup` |
| Core records, printing, and plain backup stay free. | 8 | Listed: `core-features-free` |
| Store this passphrase somewhere safe. | 5 | Useful instruction |
| One-time purchase. | 2 | Clear price context |
| Sociobot/Dodo is the merchant of record and handles refunds. | 9 | Useful payment information |

### Landing headings, labels, and controls

All are contextual, use the terminology table below, and controls name their
result: **Try it with sample data**, **Reset demo**, **Start for real**,
**Save names**, **Add medicine**, **Confirm current list**, **Download JSON**,
**Restore a backup**, **Unlock encrypted backups — $12**, **Verify license**,
and **Change light or dark theme**. The headings are “Card owner,” “Medicines
being taken,” “Change history,” “How it works,” “Privacy,” and “Protect
backups with a passphrase”; none relies on a mood or metaphor.

### README prose

| Sentence | Words | Result |
| --- | ---: | --- |
| Medication Handoff Card helps adult children, caregivers, and older adults make a clear, dated medication handoff card for family or clinicians. | 20 | Pass |
| It keeps the current list, who confirmed it, and what changed together. | 12 | Listed: `record-workflow` |
| This is a communication tool, not medical advice. | 8 | Listed: `non-clinical-scope` |
| It does not check drug interactions or recommend doses. | 8 | Listed: `non-clinical-scope` |
| Medication decisions must be confirmed with a qualified clinician or pharmacist. | 10 | Useful safety instruction |
| Records medicine name, dose/strength, timing, prescriber, and notes. | 8 | Listed: `record-workflow` |
| Preserves a dated change history when medicines are added, edited, or stopped. | 12 | Listed: `record-workflow` |
| Records the card owner, person keeping the card, confirmation date, and confirmed by. | 13 | Listed: `record-workflow` |
| Produces a large-type, one-page print/PDF handoff card. | 7 | Listed: `print-card` |
| Stores health data locally in IndexedDB; there is no health-data account or cloud copy. | 14 | Listed: `local-record`, `no-account-or-cloud-copy` |
| Exports and restores a portable plain JSON backup. | 8 | Listed: `json-backup` |
| Downloaded JSON can be opened as text. | 7 | Listed: `plain-json-readable` |
| Works offline after the first visit. | 7 | Listed: `offline-reload` |
| Offers an optional $12 one-time license for passphrase-protected backups. | 10 | Listed: `encrypted-backup`, `checkout-available` |
| The card, print view, and plain JSON backup are free. | 10 | Listed: `core-features-free` |
| Includes light and dark themes, reduced-motion behavior, medicine dialogs that keep Tab focus inside, and a responsive 390 px phone layout. | 21 | Listed: `adaptive-interface`, `dialog-keyboard` |
| Open the demo for Evelyn Parker’s three-medicine card. | 8 | Clear demo action |
| Demo data uses a separate local database named `demo:medication-handoff-card`. | 8 | Listed: `demo-isolation` |
| The persistent demo banner can reset it or start a separate real card without copying the sample. | 15 | Listed: `demo-isolation` |
| Leaving the demo discards any sample edits. | 7 | Listed: `demo-isolation` |
| Requires Node.js 20 or newer. | 5 | Technical instruction |
| Vite prints the local development URL. | 6 | Technical instruction |
| Production service-worker registration is intentionally disabled during `npm run dev`. | 8 | Technical instruction |
| Playwright 1.58.2 is pinned. | 4 | Technical instruction |
| The factory image includes its Chromium build at `$PLAYWRIGHT_BROWSERS_PATH`; elsewhere, run `npx playwright install chromium` once. | 15 | Technical instruction |
| Each public product claim has a tagged regression test declared in `.factory/claims.json`. | 11 | Verified above |
| Every exact command includes its own clean dependency install, so it also runs from a fresh clone. | 17 | Verified above |
| The static deploy artifact is `dist/`, with `dist/index.html` at its root. | 10 | Technical instruction |
| No runtime environment variables are required. | 5 | Technical instruction |
| `staticwebapp.config.json` ships the enforced CSP, immutable hashed-asset caching, manifest MIME type, SPA routes, and the designed 404 response for static deployment. | 18 | Technical instruction |
| Medication data stays in the browser unless the user downloads a backup. | 11 | Listed: `local-record` |
| Plain `.json` backups can be opened as text. | 7 | Listed: `plain-json-readable` |
| Store an encrypted-backup passphrase somewhere safe. | 6 | Useful instruction |
| The paid flow uses only the Sociobot billing API. | 9 | Listed: `checkout-available` |
| The live product is registered at $12. | 7 | Listed: `checkout-available` |
| The checkout link is derived from the product slug, and returned licenses are stored as `sb_license:medication-handoff-card`. | 14 | Technical documentation |

README headings (“What it does,” “Try the sample card,” “Local development,”
“Test and build,” “Data and licensing,” and “Project map”) identify their
sections. The README uses the same terms as the app.

| Concept | Term used |
| --- | --- |
| Printable/current record | handoff card |
| Medication entry | medicine |
| Person whose record it is | card owner |
| Person maintaining it | person keeping the card |
| Isolated example data | demo |
| Downloaded copy | backup |

## Structure, accessibility, and links

| Check | Result |
| --- | --- |
| One h1, `lang`, `<main>`, descriptive titles | Pass on `/`, `/demo`, `/privacy`, `/terms` |
| Route-specific description, canonical, OG/Twitter title and description | Pass on `/`, `/demo`, `/privacy`, `/terms` |
| Back/forward, h1 focus, route announcement | Pass: Privacy focused “Privacy” and announced “Privacy page”; Back focused the home h1 and announced “Medication handoff card” |
| Header/footer with Privacy and Terms | Pass on app/legal routes; fail for 404: F-2-2 |
| Favicon/social card/Apple icon/robots/sitemap | Pass on app routes; fail for 404 favicon metadata: F-2-2 |
| Designed HTTP 404 | Pass: unknown route returns 404 with a clear h1 and home link; metadata/skeleton gap remains F-2-2 |
| Link crawl | Pass: all first-party links 200; GitHub source 200; Sociobot checkout 303s to Dodo checkout |
| Security/privacy headers | Pass: CSP, `frame-ancestors 'none'`, Referrer-Policy, nosniff, and Permissions-Policy are live response headers |
| Visual identity | Pass: original kitchen-table scene, paper/ink/coral palette, serif document voice, and clipped-paper motif follow `.factory/design.md`; it is not a generic SaaS template |

## Earlier-review regression check

Every finding in `review-1.md` was rechecked on live and in current code.

| Earlier ID | Current result |
| --- | --- |
| F-1-1 route focus/announcement | Fixed: h1 has `tabindex="-1"`; live navigation and Back move focus and populate the polite route announcer. |
| F-1-2 per-route metadata | Fixed: `/demo`, `/privacy`, and `/terms` have route-specific title, description, canonical, OG, and Twitter values after load. |
| F-1-3 pricing/free claims | Fixed: `core-features-free` and `checkout-available` are declared and passed. |
| F-1-4 safety scope | Fixed: `non-clinical-scope` is declared and passed. |
| F-1-5 no account/cloud copy | Fixed: `no-account-or-cloud-copy` is declared and passed. |
| F-1-6 backup readability/passphrase wording | Fixed: `plain-json-readable` passes and the untestable recovery/storage promise is absent. |
| F-1-7 README implementation/keyboard wording | Fixed: the direct `dialog-keyboard` claim passes; payment-provider-ID copy is absent. |
| F-1-8 headings and terms | Fixed: current headings are “Change history” and “Privacy”; README uses “person keeping the card” and “confirmed by.” |

No earlier finding is regressed. F-2-1 and F-2-2 are new full-checklist findings.

## Missed leverage

No additional feature finding. The brief implies a local list, dated history,
large-type print/PDF, backup/restore, and an isolated demo; those workflows
exist. An AI medication recommendation or interaction checker would be unsafe
and outside the brief’s explicit non-clinical scope. Import/export is already
present, and cloud sync would contradict the local-first privacy promise.

## What would make this perfect

1. Resolve F-2-1 by putting a realistic, editable sample card above the fold
   immediately after the demo action, with a viewport regression test.
2. Resolve F-2-2 by bringing the 404 into the product metadata and
   header/footer skeleton, with an HTTP-404 browser test.
3. Re-run the full claim contract, mobile/desktop cold reads, and link/route
   checks after both changes. Only then can the verdict be PASS.
