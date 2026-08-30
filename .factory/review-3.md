# Adversarial first-read review 3 — FAIL

**Reviewed:** 2026-08-30 UTC  
**Live URL:** <https://medication-handoff-card.sociobot.in>  
**Candidate:** `6777036a05dbaf7d691e5f064b7ffd3fedf4b37a`  
**Viewports:** fresh Chromium contexts at 390 × 844 and 1440 × 900

## Verdict

**FAIL.** The product is clear on first read, opens a realistic isolated demo
in one click, passes every declared claim test, works offline, and retains all
earlier fixes. Acceptance still requires zero findings. The populated demo has
ambiguous repeated medicine-action names for screen-reader users, and two
visible control labels do not meet the supplied result-naming copy rule.

There are **no blocking findings** in this round. There are three findings in
total: one P2 accessibility finding and two P3 copy findings.

## Findings

### F-3-1 — P2: Repeated medicine controls do not name the medicine

**Location:** live `/demo`, each card under **Medicines being taken**;
`src/main.ts`, `medicationList()`.

The three medicine rows each expose the same two accessible button names:
**“Edit”** and **“Stop & remove.”** The controls have no `aria-label` or
`aria-describedby`. A screen-reader user navigating by buttons hears three
indistinguishable “Edit” controls and three indistinguishable “Stop & remove”
controls, so the target medicine is not available in the control name. Axe
does not detect this contextual-name failure.

**Fix:** Give each row action a target-specific accessible name, such as
`aria-label="Edit Lisinopril"` and
`aria-label="Stop and remove Lisinopril"`, while retaining the short visible
text if desired. Add a Playwright assertion for the unique accessible names of
all sample-row actions.

### F-3-2 — P3: “Backup & settings” is a noun-only button label

**Location:** live home and demo header; `src/main.ts`, `appPage()`.

The visible button text is **“Backup & settings.”** It names a place, not the
result of pressing the button, contrary to the supplied rule that buttons use
result-naming verbs.

**Fix:** Rename it **“Open backup settings”** and assert that visible label in
the landing copy test.

### F-3-3 — P3: “Theme” is a noun-only button label

**Location:** live `/privacy` and `/terms` header; `src/main.ts`,
`legalPage()`.

The visible button text is **“Theme.”** It does not tell the visitor what
pressing it will do.

**Fix:** Use **“Change theme”**, or dynamically name the result **“Use dark
theme”** / **“Use light theme.”** Add a route-level assertion for the visible
label and resulting theme.

## Cold first read

**PASS.** Before scrolling, both fresh viewports answer all three questions:

| Question | Answer available on the first screen | Exact live copy |
| --- | --- | --- |
| What does this do? | Makes a medication handoff card. | “Make a clear medication handoff card.” |
| For whom? | Adult children, caregivers, and older adults sharing a checked list. | “For adult children, caregivers, and older adults sharing a checked list with family or clinicians.” |
| What should I click first? | Open a completed example. | “Try it with sample data” and “See a completed card for Evelyn Parker.” |

The primary action and all three facts are visible at 390 × 844. The first
screen has one h1, no console error, and no horizontal overflow.

## Copy audit

Counts use whitespace-delimited words. Hyphenated terms and numbers count as
one word. Repeated identical labels are listed once with their locations.

### Landing page: every visible copy item

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Medication Handoff Card | 3 | Pass |
| Try demo | 2 | Pass |
| Privacy | 1 | Pass; repeated in section/footer |
| Print / PDF | 3 | Pass; “Print” is the action and PDF is the result |
| Backup & settings | 3 | **Flag F-3-2** |
| A dated list for the next handoff | 7 | Pass |
| Make a clear medication handoff card. | 6 | Pass |
| For adult children, caregivers, and older adults sharing a checked list with family or clinicians. | 15 | Pass |
| Try it with sample data | 5 | Pass |
| See a completed card for Evelyn Parker. | 7 | Pass |
| Records stay in this browser. | 5 | Listed: `local-record` |
| Works offline after the first visit. | 6 | Listed: `offline-reload` |
| Card, print, and JSON backup are free; encrypted backups cost $12 once. | 12 | Listed: `core-features-free`, `checkout-available` |
| Communication tool, not medical advice. | 5 | Listed: `non-clinical-scope` |
| No interaction checks or dose recommendations. | 6 | Listed: `non-clinical-scope` |
| Confirm every change with a qualified clinician or pharmacist. | 9 | Useful safety instruction |
| Card owner | 2 | Pass |
| Whose medicines are these? | 4 | Pass |
| Person’s name | 2 | Pass |
| Person keeping this card | 4 | Pass |
| You, a relative, or the card owner | 7 | Pass |
| Save names | 2 | Pass |
| Current list · 0 | 4 | Pass |
| Medicines being taken | 3 | Pass |
| Start with the current list | 5 | Pass |
| No medicines on this card yet | 6 | Pass |
| A blank card, glasses, pill organizer, and unbranded medicine bottles arranged on a quiet kitchen table | 16 | Pass; informative image alt |
| Add exactly what is written on the label. | 8 | Pass |
| This tool records what you enter; it does not check whether a medicine or dose is right. | 17 | Listed: `non-clinical-scope` |
| Add first medicine | 3 | Pass |
| Change history | 2 | Pass |
| What changed | 2 | Pass |
| Changes will appear here automatically when you add, edit, or stop a medicine. | 13 | Listed: `record-workflow` |
| Three steps | 2 | Pass |
| How it works | 3 | Pass |
| Record the list. | 3 | Pass |
| Copy each medicine, dose, timing, and prescriber from a trusted source. | 11 | Pass |
| Check the handoff. | 3 | Pass |
| Confirm the current list and keep dated changes. | 8 | Listed: `record-workflow` |
| Share a copy. | 3 | Pass |
| Print one page or download a JSON backup. | 8 | Listed: `print-card`, `json-backup` |
| Your record stays on this device | 6 | Pass |
| There is no health-data account or cloud copy. | 8 | Listed: `no-account-or-cloud-copy` |
| You choose when to print or download a backup. | 9 | Pass |
| Read the privacy details | 4 | Pass |
| Optional · $12 once | 4 | Listed: `checkout-available` |
| Protect backups with a passphrase | 5 | Pass |
| Encrypted backup is the only paid feature. | 7 | Listed: `core-features-free` |
| The card, print view, and plain JSON backup are free. | 10 | Listed: `core-features-free` |
| Buy encrypted backups — $12 | 5 | Pass |
| Your health record stays in this browser during normal use. | 10 | Listed: `local-record` |
| Terms | 1 | Pass |
| Source (external) | 2 | Pass |
| Scene generated for this product; no person or brand is depicted. | 11 | Useful asset provenance |
| Built by Param Factory · v1.0.3 | 6 | Pass |

No landing sentence exceeds 22 words. There are no banned marketing words,
mood headings, metaphors, or inconsistent product terms. F-3-2 is the only
landing-page copy flag.

### Demo action copy

The demo banner, **Reset demo**, **Start for real**, **Add medicine**, and
**Confirm current list** are clear. The repeated **Edit** and **Stop & remove**
controls use verbs but omit their target from the accessible name; see F-3-1.

### README: every prose sentence

| Sentence | Words | Result |
| --- | ---: | --- |
| Medication Handoff Card helps adult children, caregivers, and older adults make a clear, dated medication handoff card for family or clinicians. | 21 | Pass |
| It keeps the current list, who confirmed it, and what changed together. | 12 | Listed: `record-workflow` |
| This is a communication tool, not medical advice. | 8 | Listed: `non-clinical-scope` |
| It does not check drug interactions or recommend doses. | 9 | Listed: `non-clinical-scope` |
| Medication decisions must be confirmed with a qualified clinician or pharmacist. | 11 | Useful safety instruction |
| Records medicine name, dose/strength, timing, prescriber, and notes. | 8 | Listed: `record-workflow` |
| Preserves a dated change history when medicines are added, edited, or stopped. | 12 | Listed: `record-workflow` |
| Records the card owner, person keeping the card, confirmation date, and confirmed by. | 13 | Listed: `record-workflow` |
| Produces a large-type, one-page print/PDF handoff card. | 7 | Listed: `print-card` |
| Stores health data locally in IndexedDB; there is no health-data account or cloud copy. | 14 | Listed: `local-record`, `no-account-or-cloud-copy` |
| Exports and restores a portable plain JSON backup. | 8 | Listed: `json-backup` |
| Downloaded JSON can be opened as text. | 7 | Listed: `plain-json-readable` |
| Works offline after the first visit. | 6 | Listed: `offline-reload` |
| Offers an optional $12 one-time license for passphrase-protected backups. | 9 | Listed: `encrypted-backup`, `checkout-available` |
| The card, print view, and plain JSON backup are free. | 10 | Listed: `core-features-free` |
| Includes light and dark themes, reduced-motion behavior, medicine dialogs that keep Tab focus inside, and a responsive 390 px phone layout. | 21 | Listed: `adaptive-interface`, `dialog-keyboard` |
| Open the demo for Evelyn Parker’s three-medicine card. | 8 | Pass |
| Demo data uses a separate local database named `demo:medication-handoff-card`. | 9 | Listed: `demo-isolation` |
| The persistent demo banner can reset it or start a separate real card without copying the sample. | 17 | Listed: `demo-isolation` |
| Leaving the demo discards any sample edits. | 7 | Listed: `demo-isolation` |
| Requires Node.js 20 or newer. | 5 | Clear development requirement |
| Vite prints the local development URL. | 6 | Clear development instruction |
| Production service-worker registration is intentionally disabled during `npm run dev`. | 10 | Verified implementation note |
| Playwright 1.58.2 is pinned. | 4 | Verified in `package.json` |
| The factory image includes its Chromium build at `$PLAYWRIGHT_BROWSERS_PATH`; elsewhere, run `npx playwright install chromium` once. | 16 | Clear setup instruction |
| Each public product claim has a tagged regression test declared in `.factory/claims.json`. | 12 | Verified: exactly one tag for each of 15 claims |
| Every exact command includes its own clean dependency install, so it also runs from a fresh clone. | 17 | Verified by the clean-clone claim run |
| The static deploy artifact is `dist/`, with `dist/index.html` at its root. | 11 | Verified by `npm run build` |
| No runtime environment variables are required. | 6 | Verified build/deployment note |
| `staticwebapp.config.json` ships the enforced CSP, immutable hashed-asset caching, manifest MIME type, SPA routes, and the designed 404 response for static deployment. | 21 | Verified configuration note |
| Medication data stays in the browser unless the user downloads a backup. | 12 | Listed: `local-record` |
| Plain `.json` backups can be opened as text. | 8 | Listed: `plain-json-readable` |
| Store an encrypted-backup passphrase somewhere safe. | 6 | Useful instruction |
| The paid flow uses only the Sociobot billing API. | 9 | Listed: `checkout-available` |
| The live product is registered at $12. | 7 | Listed: `checkout-available` |
| The checkout link is derived from the product slug, and returned licenses are stored as `sb_license:medication-handoff-card`. | 16 | Verified implementation note |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

README headings are descriptive: **What it does**, **Try the sample card**,
**Local development**, **Test and build**, **Data and licensing**, **Project
map**, and **License**. The nine project-map entries are factual fragments of
4–10 words; each matches the referenced file. No README sentence exceeds 22
words, uses a banned marketing word, or needs a rewrite.

### Terminology

| Concept | Term used consistently |
| --- | --- |
| Printable/current record | handoff card |
| Medication entry | medicine |
| Person whose record it is | card owner |
| Person maintaining it | person keeping the card |
| Isolated example data | demo |
| Downloaded data copy | backup |

## Demo and sandbox behavior

**PASS.** The landing action opens `/?demo=1` in one click. At 390 × 844, the
first screen contains the persistent banner, Reset, Start for real, Evelyn
Parker, confirmation details, and the complete Lisinopril sample summary. Its
sample card ended at y=534 in an 844 px viewport. Desktop also shows the
populated card before scrolling.

The live isolation flow verified all of the following in a fresh context:

- saved a real card for Ruth Review Three;
- entered the demo and changed Lisinopril’s note;
- Reset restored “Take as listed on the pharmacy label.”;
- made a second demo edit, selected Start for real, and found Ruth’s real card
  unchanged;
- reopened `/demo` and found the original sample note;
- observed separate `medication-handoff-card` and
  `demo:medication-handoff-card` IndexedDB databases;
- recorded eight requests during the flow, all to the product’s own origin;
- loaded `/demo`, enabled browser offline mode, reloaded, and retained Evelyn
  Parker plus the visible Offline status.

The one early desktop capture read the page before asynchronous route loading
finished. Five controlled reruns that waited for the demo banner all opened the
sample correctly; this was not reproducible as a product failure.

## Claims contract

`.factory/claims.json` contains 15 entries, each with exactly one matching
`@claim:<id>` test. Every literal command was run from the clean clone
`/tmp/mhc-review3-Wfm0Yr/repo`; each command performed its declared clean
dependency install and exited successfully.

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

No live landing or README product promise is unlisted. Development and deploy
statements in the README are operational documentation rather than end-user
claims; they were still checked against `package.json`, the deployment
configuration, the clean-clone run, and the production build.

`CI=1 npm test` also passed: 10 Vitest tests and 64 Playwright tests. `npm run
build` passed and produced `dist/index.html`; JavaScript is 45.54 kB raw /
14.26 kB gzip and CSS is 20.49 kB raw / 5.28 kB gzip.

## Structure, links, and accessibility

| Check | Result |
| --- | --- |
| Route titles | Pass on `/`, `/demo`, `/privacy`, `/terms`, and 404; each is route-specific and plain |
| One h1, `lang`, and main landmark | Pass on all five routes |
| Description, canonical, OG/Twitter, favicon | Pass on all five routes; required assets return 200 |
| Designed 404 | Pass: an unknown URL returns HTTP 404 with product header, footer, legal links, and return action |
| Deep links and browser Back | Pass: Privacy receives h1 focus and “Privacy page”; Back focuses the home h1 and announces “Medication handoff card” |
| Skip link | Pass: `#main-content` reaches the single main landmark on app and 404 routes |
| Link crawl | Pass: all first-party content links return 200; source returns 200; checkout returns the expected 303; in-page skip links resolve |
| Security headers | Pass: live CSP, `frame-ancestors 'none'`, Referrer-Policy, nosniff, Permissions-Policy, and HSTS are present |
| Live console | Pass: no errors on home, demo, legal routes, or 404 |
| Axe | Pass: zero violations on home, demo, Privacy, Terms, and 404 at 390 px |
| Visual identity | Pass: paper/ink/coral palette, serif record typography, clipped-paper rule, and original kitchen-table art match `.factory/design.md`; this is not a generic SaaS template |

`verify-url.sh` passed live home and demo: HTTP 200, one h1, `lang=en`, a main
landmark, no missing alt text, no unnamed buttons, and zero console errors.
The manual accessible-name inspection found F-3-1, which automated axe and
unnamed-button checks do not detect.

## Earlier-finding regression check

Every finding in `review-1.md` and `review-2.md`, plus the closure claims in
`polish-1.md`, `polish-2.md`, and the prior handoff, was checked live and in
current code.

| Earlier ID | Current result |
| --- | --- |
| F-1-1 route focus/announcement | Fixed: live Privacy and Back checks passed; `focusAndAnnounceRoute()` handles h1 focus and the polite announcement. |
| F-1-2 route metadata | Fixed: title, description, canonical, OG, and Twitter metadata are route-specific live and in `syncRouteMetadata()`. |
| F-1-3 pricing/free claims | Fixed: `core-features-free` and `checkout-available` are listed and passed. |
| F-1-4 safety scope | Fixed: `non-clinical-scope` is listed and passed. |
| F-1-5 no account/cloud copy | Fixed: `no-account-or-cloud-copy` passed; the independent demo request log was same-origin only. |
| F-1-6 backup readability/passphrase copy | Fixed: `plain-json-readable` passed and the unrecoverable-passphrase promise remains absent. |
| F-1-7 README implementation/keyboard wording | Fixed: the low-value provider-ID sentence remains absent and `dialog-keyboard` passed. |
| F-1-8 abstract headings/inconsistent terms | Fixed: **Change history** and **Privacy** remain; README terms match the app. |
| F-2-1 demo sample below the fold | Fixed: Evelyn and the complete Lisinopril summary are above the fold on both required viewports; the bounding-box regression passed. |
| F-2-2 incomplete 404 shell | Fixed: live 404 has route metadata, favicon, header, footer, Privacy, and Terms, and returns HTTP 404. |

No earlier finding is unfixed, half-fixed, or regressed. The earlier reported
one-off mobile test flake did not recur in the 64-test run.

## Missed leverage

No finding. The brief calls for a local medication list, dated history,
large-type print/PDF, and protected export. Those workflows exist, including
JSON import/restore. Cloud sync would weaken the stated local-first privacy
model. An AI interaction checker, dose recommendation, or medication summary
would introduce clinical risk and conflict with the explicit non-clinical
scope, so no Sociobot gateway feature is warranted.

## What would make this perfect

1. Give every medicine-row action a unique target-specific accessible name and
   test the sample rows by role and accessible name.
2. Rename **Backup & settings** to **Open backup settings**.
3. Rename the legal-route **Theme** control to a verb-led result, then rerun
   the full copy, claims, accessibility, and live-route checks.

Only after those three findings are closed is a zero-finding PASS appropriate.
