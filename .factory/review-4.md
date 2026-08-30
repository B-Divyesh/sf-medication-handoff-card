# Adversarial first-read review 4 — FAIL

**Reviewed:** 2026-08-30 UTC  
**Live URL:** <https://medication-handoff-card.sociobot.in>  
**Viewports:** fresh Chromium contexts at 390 × 844 and 1440 × 900

## Verdict

**FAIL.** The first read, one-click demo, real job workflow, privacy sandbox,
offline reload, route structure, and all 15 declared claims pass. There are
still three unlisted, visitor-reliance claims on the live Privacy and Terms
routes. The only payment test proves a 303 to a Dodo checkout; it does not
prove these extra assertions. Acceptance requires zero findings.

## Findings

### F-4-1 — P2: Privacy page promises a license-data boundary without a declared test

**Location:** live `/privacy`, **What leaves your device**:

> “When you verify a paid license, only the license token is sent to the
> Sociobot billing API.”

`local-record` and `no-account-or-cloud-copy` record ordinary demo editing;
neither enters license verification or asserts the verification request URL,
query/body, and absence of health-record fields. `encrypted-backup` stubs the
verification endpoint, but also does not inspect the request. A visitor can
reasonably rely on this as a health-data privacy promise, so it is an unlisted
claim.

**Fix:** Add a `license-verification-data` entry to `claims.json`, name this
Privacy-page sentence in `where`, and add a fresh-demo Playwright test that
records the explicit verification request and asserts that it contains only
the license token and product identifier, not sample-record values. Otherwise
replace the sentence with the already-tested local-record statement.

### F-4-2 — P2: Privacy page makes an untested checkout/merchant assertion

**Location:** live `/privacy`, **What leaves your device**:

> “The hosted checkout is operated by Sociobot, with Dodo as merchant of
> record, under their payment privacy terms.”

The declared `checkout-available` test proves the exact product checkout URL
returns a 303 to `checkout.dodopayments.com`. It does not prove who operates
the hosted checkout, merchant-of-record status, or which privacy terms apply.
Those are material payment statements with no matching claim entry and test.

**Fix:** Either reduce the copy to the observable and tested “Checkout opens
through Sociobot and Dodo,” or add a separately documented, deterministic
payment-policy verification that establishes each retained statement.

### F-4-3 — P2: Terms promise refund behaviour without a declared test

**Location:** live `/terms`, **One-time unlock** (and repeated in the live
backup-settings dialog):

> “Sociobot/Dodo is the merchant of record and handles payment and refunds; a
> refund revokes the associated license.”

No `claims.json` entry names refund handling or entitlement revocation. The
checkout test stops at a redirect and the encrypted-backup test only stubs a
valid license response. A purchaser could rely on this sentence before
buying; it therefore cannot remain as an unlisted claim.

**Fix:** Add a `refund-revokes-license` claim with a recorded/Sociobot billing
fixture that returns a revoked verification result and asserts encrypted export
stays locked, plus a policy test for the shown refund wording. If that billing
state cannot be verified in the sandbox, remove the refund/revocation promise
and link to the provider’s terms instead.

## Cold first read

**PASS.** Before scrolling on both fresh viewports, the home screen answers
all three required questions.

| Question | Cold visitor answer | Evidence |
| --- | --- | --- |
| What does it do? | It makes a medication handoff card. | “Make a clear medication handoff card.” |
| For whom? | Adult children, caregivers, and older adults sharing a checked list. | The one-sentence lede names the people and family/clinician handoff. |
| What should I click first? | Try the completed Evelyn Parker sample. | The visible primary action says “Try it with sample data,” followed by what it opens. |

At 390 px the primary action was at y=490–536, well inside the 844 px first
screen. There were no console or page errors. The visual treatment is the
document-like paper/ink/coral system and original kitchen-table scene specified
in `design.md`, not a generic SaaS template.

## Copy audit

Counts use whitespace-delimited words; hyphenated forms, numbers, and symbols
are one token when separated by whitespace. All rendered home and README
sentences are at or below 22 words. The landing and README have no banned
marketing adjectives, jargon-led promise, metaphor heading, inconsistent core
term, or non-result-naming action. Claimed product statements below map to a
listed claim unless noted in the findings above.

### Home: rendered sentences

| Copy | Words | Check |
| --- | ---: | --- |
| A dated list for the next handoff | 7 | Concrete context |
| Make a clear medication handoff card. | 6 | Plain job headline |
| For adult children, caregivers, and older adults sharing a checked list with family or clinicians. | 15 | Audience and outcome |
| See a completed card for Evelyn Parker. | 7 | Explains the first action |
| Records stay in this browser. | 5 | `local-record` |
| Works offline after the first visit. | 6 | `offline-reload` |
| Card, print, and JSON backup are free; encrypted backups cost $12 once. | 12 | `core-features-free`, `checkout-available` |
| Communication tool, not medical advice. | 5 | `non-clinical-scope` |
| No interaction checks or dose recommendations. | 6 | `non-clinical-scope` |
| Confirm every change with a qualified clinician or pharmacist. | 9 | Useful safety instruction |
| You, a relative, or the card owner | 7 | Field help |
| Add exactly what is written on the label. | 8 | Useful next step |
| This tool records what you enter; it does not check whether a medicine or dose is right. | 17 | `non-clinical-scope` |
| Changes will appear here automatically when you add, edit, or stop a medicine. | 13 | `record-workflow` |
| The 20 latest entries are shown. | 6 | `full-history-backup` |
| All history is included in backups. | 6 | `full-history-backup` |
| Copy each medicine, dose, timing, and prescriber from a trusted source. | 11 | Useful instruction |
| Confirm the current list and keep dated changes. | 8 | `record-workflow` |
| Print one page or download a JSON backup. | 8 | `print-card`, `json-backup` |
| There is no health-data account or cloud copy. | 8 | `no-account-or-cloud-copy` |
| You choose when to print or download a backup. | 9 | Useful description |
| Encrypted backup is the only paid feature. | 7 | `core-features-free` |
| The card, print view, and plain JSON backup are free. | 10 | `core-features-free` |
| Your health record stays in this browser during normal use. | 10 | `local-record` |
| Scene generated for this product; no person or brand is depicted. | 11 | Asset provenance |

### Home: headings and actions

| Copy | Words | Check |
| --- | ---: | --- |
| Medication Handoff Card | 3 | Product name |
| Try demo | 2 | Destination-naming link |
| Privacy | 1 | Concrete link/heading |
| Print / PDF | 3 | Result-naming action |
| Open backup settings | 3 | Result-naming action |
| Try it with sample data | 5 | Result-naming primary action |
| Card owner | 2 | Concrete heading |
| Whose medicines are these? | 4 | Concrete heading |
| Person’s name | 2 | Field label |
| Person keeping this card | 4 | Field label |
| Save names | 2 | Result-naming action |
| Medicines being taken | 3 | Concrete heading |
| Start with the current list | 5 | Concrete instruction |
| No medicines on this card yet | 6 | Clear empty state |
| Add first medicine | 3 | Result-naming action |
| Change history | 2 | Concrete heading |
| What changed | 2 | Concrete heading |
| How it works | 3 | Concrete heading |
| Record the list. | 3 | Step action |
| Check the handoff. | 3 | Step action |
| Share a copy. | 3 | Step action |
| Your record stays on this device | 6 | Concrete privacy heading |
| Read the privacy details | 4 | Result-naming link |
| Protect backups with a passphrase | 5 | Concrete heading |
| Buy encrypted backups — $12 | 5 | Result-naming action and price |
| Terms | 1 | Concrete link |
| Source (external) | 2 | Destination disclosure |

### README: every sentence

| Sentence | Words | Check |
| --- | ---: | --- |
| Medication Handoff Card helps adult children, caregivers, and older adults make a clear, dated medication handoff card for family or clinicians. | 21 | Plain purpose |
| It keeps the current list, who confirmed it, and what changed together. | 12 | `record-workflow` |
| This is a communication tool, not medical advice. | 8 | `non-clinical-scope` |
| It does not check drug interactions or recommend doses. | 9 | `non-clinical-scope` |
| Medication decisions must be confirmed with a qualified clinician or pharmacist. | 11 | Useful safety instruction |
| Records medicine name, dose/strength, timing, prescriber, and notes. | 8 | `record-workflow` |
| Preserves a dated change history when medicines are added, edited, or stopped. | 12 | `record-workflow` |
| Records the card owner, person keeping the card, confirmation date, and confirmed by. | 13 | `record-workflow` |
| Produces a large-type, one-page print/PDF handoff card. | 7 | `print-card` |
| Stores health data locally in IndexedDB; there is no health-data account or cloud copy. | 14 | `local-record`, `no-account-or-cloud-copy` |
| Exports and restores a portable plain JSON backup. | 8 | `json-backup` |
| Downloaded JSON can be opened as text. | 7 | `plain-json-readable` |
| Works offline after the first visit. | 6 | `offline-reload` |
| Offers an optional $12 one-time license for passphrase-protected backups. | 9 | `encrypted-backup`, `checkout-available` |
| The card, print view, and plain JSON backup are free. | 10 | `core-features-free` |
| Includes light and dark themes, reduced-motion behavior, medicine dialogs that keep Tab focus inside, and a responsive 390 px phone layout. | 21 | `adaptive-interface`, `dialog-keyboard` |
| Open the demo for Evelyn Parker’s three-medicine card. | 8 | Clear demo link |
| Demo data uses a separate local database named `demo:medication-handoff-card`. | 9 | `demo-isolation` |
| The persistent demo banner can reset it or start a separate real card without copying the sample. | 17 | `demo-isolation` |
| Leaving the demo discards any sample edits. | 7 | `demo-isolation` |
| Requires Node.js 20 or newer. | 5 | Development requirement |
| Vite prints the local development URL. | 6 | Development instruction |
| Production service-worker registration is intentionally disabled during `npm run dev`. | 10 | Verified implementation note |
| Playwright 1.58.2 is pinned. | 4 | Verified configuration |
| The factory image includes its Chromium build at `$PLAYWRIGHT_BROWSERS_PATH`; elsewhere, run `npx playwright install chromium` once. | 16 | Setup instruction |
| Each public product claim has a tagged regression test declared in `.factory/claims.json`. | 12 | 15 entries/tags confirmed |
| Every exact command includes its own clean dependency install, so it also runs from a fresh clone. | 17 | Clean-clone run confirmed |
| The static deploy artifact is `dist/`, with `dist/index.html` at its root. | 11 | Build confirmed |
| No runtime environment variables are required. | 6 | Build confirmed |
| `staticwebapp.config.json` ships the enforced CSP, immutable hashed-asset caching, manifest MIME type, SPA routes, and the designed 404 response for static deployment. | 21 | Configuration confirmed |
| Medication data stays in the browser unless the user downloads a backup. | 12 | `local-record` |
| Plain `.json` backups can be opened as text. | 8 | `plain-json-readable` |
| Store an encrypted-backup passphrase somewhere safe. | 6 | Useful instruction |
| The paid flow uses only the Sociobot billing API. | 9 | `checkout-available` |
| The live product is registered at $12. | 7 | `checkout-available` |
| The checkout link is derived from the product slug, and returned licenses are stored as `sb_license:medication-handoff-card`. | 16 | Verified implementation note |
| MIT. | 1 | License declaration |
| See LICENSE. | 2 | License pointer |

README headings—**What it does**, **Try the sample card**, **Local
development**, **Test and build**, **Data and licensing**, **Project map**, and
**License**—name their sections. Project-map bullets are file descriptions, not
sentences; their terms match the files. The terminology remains consistent:
*handoff card*, *medicine*, *card owner*, *person keeping the card*, *demo*,
and *backup*.

## Demo and sandbox behaviour

**PASS.** The home action opened `/?demo=1` in one click. The 390 px first demo
screen visibly contained the persistent demo banner, **Reset demo**, **Start
for real**, Evelyn Parker, confirmation details, Lisinopril, dose, timing,
prescriber, and Edit. The Lisinopril text was at y=443–466 of the 844 px
viewport; on desktop it was y=226–253 of 900 px.

In a fresh production context, demo mode opened only
`demo:medication-handoff-card`; editing its Lisinopril note succeeded, **Reset
demo** restored “Take as listed on the pharmacy label.”, and **Start for real**
opened the empty real-card owner state. The request log contained four requests
and exactly one origin: `https://medication-handoff-card.sociobot.in`. A fresh
service-worker context loaded `/demo`, went offline, reloaded, and retained
Evelyn Parker with “Offline: your card still works and saves on this device.”

## Claims contract and local quality gates

**PASS for the 15 declared claims.** Each literal `claims.json` command was
run from temporary clean clone `/tmp/mhc-review-4-oEhlSI/repo`; the tagged
desktop and 390 px test passed for all IDs:

`demo-isolation`, `local-record`, `offline-reload`, `json-backup`,
`full-history-backup`, `print-card`, `dialog-keyboard`, `encrypted-backup`,
`record-workflow`, `adaptive-interface`, `checkout-available`,
`core-features-free`, `non-clinical-scope`, `no-account-or-cloud-copy`, and
`plain-json-readable`.

`CI=1 npm test` passed (10 Vitest tests and 68 Playwright tests), and `npm run
build` produced `dist/`. The built JavaScript gzip size was 14,182 bytes.
Every claim ID has exactly one `@claim:<id>` tag. These results do not resolve
F-4-1 through F-4-3 because no declared test covers their quoted promises.

## Structure, routes, accessibility, and links

| Check | Result |
| --- | --- |
| Title, h1, lang, main | Pass on `/`, `/demo`, `/privacy`, `/terms`, and real HTTP 404. |
| Metadata | Pass: description, canonical, OG/Twitter title, favicon, Apple icon, social image are route-specific. |
| Routing | Pass: `/` → Privacy focuses “Privacy” and announces “Privacy page”; Back focuses the home h1 and announces “Medication handoff card.” |
| Header/footer | Pass on all routes, including 404; Privacy and Terms are present. |
| 404 | Pass: `/no-such-review-4` returned 404 with “That page is not here.” and a return action. |
| Link crawl | Pass: first-party routes/assets returned 200; checkout returned 303 to Dodo; source returned 200. |
| Security | Pass: production supplies CSP with response-header `frame-ancestors 'none'`, strict referrer policy, nosniff, permissions policy, and HSTS. |
| Accessibility | Pass in the 68-test suite: axe serious/critical checks, keyboard dialog containment, 390 px, dark theme, reduced motion, and named medicine controls. |
| Console | Pass: zero live errors on fresh mobile and desktop home/demo checks. |

## Earlier findings regression check

All historical finding IDs are actually fixed in source and production:

| Earlier ID | Current verification |
| --- | --- |
| F-1-1 | Route h1 focus and polite announcement work on navigation and Back. |
| F-1-2 | Demo, Privacy, and Terms set their own title, description, canonical, OG, and Twitter metadata. |
| F-1-3 | Free core/$12 boundary is declared and its claim test passed. |
| F-1-4 | Record-only boundary is declared and its claim test passed. |
| F-1-5 | No-account/cloud-copy UI and request assertion passed. |
| F-1-6 | Readable JSON is tested; unsupported passphrase-recovery wording remains absent. |
| F-1-7 | Direct dialog keyboard test exists; provider-ID copy remains absent. |
| F-1-8 | “Change history” and “Privacy” remain concrete; terms are consistent. |
| F-2-1 | Completed Evelyn/Lisinopril sample is above the fold on both required viewports. |
| F-2-2 | HTTP 404 has product metadata, header/footer, legal links, and a return action. |
| F-3-1 | Medicine-row controls have target-specific accessible names. |
| F-3-2 | Header control says “Open backup settings.” |
| F-3-3 | Theme controls say the next result: “Use dark/light theme.” |

## Missed leverage

No feature finding. The brief’s valuable workflows—local record, dated history,
large-type print/PDF, JSON import/export, encrypted export, and isolated demo—
are present. An AI interaction, dose, or summary feature would introduce
clinical-risk expectations contrary to the stated record-only scope; cloud sync
would contradict the local-first privacy model.

## What would make this perfect

1. Resolve F-4-1 through F-4-3 by testing the retained legal/payment promises
   in the claim sandbox or removing the portions that cannot be tested.
2. Re-run all exact claim commands from a clean clone and repeat the live
   mobile/desktop, offline, and payment-link checks.

