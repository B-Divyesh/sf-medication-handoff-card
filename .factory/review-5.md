# Adversarial first-read review 5 — FAIL

**Reviewed:** 2026-08-30 UTC  
**Live URL:** https://medication-handoff-card.sociobot.in  
**Viewports:** new Chromium contexts at 390 × 844 and 1440 × 1000

## Verdict

**FAIL.** The first-read, one-click demo, isolated storage, offline reload, routing, links, visual identity, and all 17 declared claim commands pass. However, three visitor-reliance statements on the live Privacy and Terms pages have no corresponding claims.json entry and observable tagged test. The README consequently also makes a false catalogue-completeness statement. Acceptance requires zero unlisted claims.

## Findings

### F-5-1 — P2: The Privacy page makes unlisted tracking and request-log claims

**Location:** live /privacy, **Analytics and health data**:

> “This app includes no advertising, tracking SDK, analytics script, cloud account, or health-data upload. Your browser or hosting provider may keep standard short-lived request logs.”

no-account-or-cloud-copy checks that an edited demo makes same-origin requests and exposes no account or sync control. local-record also records the demo request origins. Neither test checks for self-hosted tracking or analytics code, nor can either establish a hosting provider's logging and retention practice. There is no claim entry naming either sentence. A person choosing a tool for medication details can reasonably rely on this privacy statement.

**Concrete fix:** Split the statement. Add a no-tracking-code claim that scans the built app and a fresh demo request log for declared analytics/ad origins and asserts none are present; name the exact Privacy sentence in where. Remove “Your browser or hosting provider may keep standard short-lived request logs” unless a documented, deterministic hosting-log policy can be tested. Keep the existing no-account/health-upload statement only with its current claimed coverage.

### F-5-2 — P2: The Terms page extends the clinical-scope claim beyond its test

**Location:** live /terms, **Not medical advice**:

> “Medication Handoff Card does not check interactions, recommend doses, diagnose, dispense, or send alerts.”

The only relevant entry, non-clinical-scope, is explicitly limited to “does not check interactions or recommend doses.” Its tagged test checks the record-only editor, absence of an interaction/recommendation action, and the print wording. It does not assert the additional promises that the product does not diagnose, dispense, or send alerts. These are material safety-scope claims for a medication product and are not named by a claims.json entry.

**Concrete fix:** Either narrow the Terms sentence to the exact declared claim, or add a record-only-scope claim whose clean-demo test verifies the visible product offers no diagnose, dispense, or alert action and covers this Terms copy and the print/landing scope text.

### F-5-3 — P3: Privacy/deletion statements exceed the declared storage tests

**Location:** live /privacy, **What is stored** and **Exports and deletion**:

> “Names, medication details, confirmation details, and change history are stored in IndexedDB on your device. Your theme choice and optional license token are stored in localStorage.”

> “Clear this site's storage in your browser to delete the local record.”

The declared local-record test records network requests; it does not inspect the actual IndexedDB/localStorage keys and values. demo-isolation confirms the two database namespaces and demo reset/exit, but does not test clearing site storage or the privacy-page storage inventory. These are useful storage and deletion promises, not merely implementation details, and no claim entry names them.

**Concrete fix:** Add storage-and-delete to claims.json. In a fresh real card, save a medicine, confirmation, theme preference, and a fixture license; assert the stated IndexedDB/localStorage locations, clear site storage, reload, and assert no record remains. Name both Privacy sentences in where. If that is not the intended supported deletion flow, replace the deletion sentence with the tested flow.

## Cold first read

**PASS.** Before scrolling at both widths, the home screen answers all three required questions.

| Question | Cold visitor answer | Exact first-screen evidence |
| --- | --- | --- |
| What does this do? | Make a medication handoff card. | “Make a clear medication handoff card.” |
| For whom? | Adult children, caregivers, and older adults sharing a checked list. | “For adult children, caregivers, and older adults sharing a checked list with family or clinicians.” |
| What should I click first? | Open the completed sample. | “Try it with sample data” and “See a completed card for Evelyn Parker.” |

At 390 px the primary sample link was visible at y=490–536. The desktop version showed the same job, audience, action, price, and safety boundary. Neither fresh context logged a console or page error.

## Copy audit

Counts use whitespace-delimited words; hyphenated forms and numbers count as one word. The landing and README have no sentence longer than 22 words, no banned marketing adjective, no jargon-led or metaphor heading, no inconsistent core term, and no non-result-naming product action. The unlisted legal claims above make the README catalogue-completeness sentence false; that row is flagged F-5-1.

### Landing page: every sentence

| Sentence | Words | Check |
| --- | ---: | --- |
| A dated list for the next handoff | 7 | Concrete context |
| Make a clear medication handoff card. | 6 | Plain job headline |
| For adult children, caregivers, and older adults sharing a checked list with family or clinicians. | 15 | Audience and outcome |
| See a completed card for Evelyn Parker. | 7 | Explains the first action |
| Records stay in this browser. | 5 | local-record |
| Works offline after the first visit. | 6 | offline-reload |
| Card, print, and JSON backup are free; encrypted backups cost $12 once. | 12 | core-features-free, checkout-available |
| Communication tool, not medical advice. | 5 | non-clinical-scope |
| No interaction checks or dose recommendations. | 6 | non-clinical-scope |
| Confirm every change with a qualified clinician or pharmacist. | 9 | Useful safety instruction |
| You, a relative, or the card owner | 7 | Field help |
| No medicines on this card yet | 6 | Clear empty state |
| Add exactly what is written on the label. | 8 | Useful next step |
| This tool records what you enter; it does not check whether a medicine or dose is right. | 17 | non-clinical-scope |
| Changes will appear here automatically when you add, edit, or stop a medicine. | 13 | record-workflow |
| Copy each medicine, dose, timing, and prescriber from a trusted source. | 11 | Useful instruction |
| Confirm the current list and keep dated changes. | 8 | record-workflow |
| Print one page or download a JSON backup. | 8 | print-card, json-backup |
| There is no health-data account or cloud copy. | 8 | no-account-or-cloud-copy |
| You choose when to print or download a backup. | 9 | Useful description |
| Encrypted backup is the only paid feature. | 7 | core-features-free |
| The card, print view, and plain JSON backup are free. | 10 | core-features-free |
| Your health record stays in this browser during normal use. | 10 | local-record |
| Scene generated for this product; no person or brand is depicted. | 11 | Asset provenance |

### Landing headings, labels, and actions

| Copy | Words | Check |
| --- | ---: | --- |
| Medication Handoff Card | 3 | Product name |
| Try demo | 2 | Names its destination |
| Privacy | 1 | Concrete destination/section |
| Print / PDF | 3 | Names the result |
| Open backup settings | 3 | Verb-led result |
| Try it with sample data | 5 | Primary result |
| Card owner | 2 | Concrete section label |
| Whose medicines are these? | 4 | Concrete heading |
| Person’s name | 2 | Field label |
| Person keeping this card | 4 | Field label |
| Save names | 2 | Result-naming action |
| Medicines being taken | 3 | Concrete heading |
| Start with the current list | 5 | Concrete instruction |
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
| Buy encrypted backups — $12 | 5 | Result and exact price |
| Terms | 1 | Concrete legal link |
| Source (external) | 2 | Destination disclosure |

### README: every sentence

| Sentence | Words | Check |
| --- | ---: | --- |
| Medication Handoff Card helps adult children, caregivers, and older adults make a clear, dated medication handoff card for family or clinicians. | 21 | Plain purpose |
| It keeps the current list, who confirmed it, and what changed together. | 12 | record-workflow |
| This is a communication tool, not medical advice. | 8 | non-clinical-scope |
| It does not check drug interactions or recommend doses. | 9 | non-clinical-scope |
| Medication decisions must be confirmed with a qualified clinician or pharmacist. | 11 | Useful safety instruction |
| Records medicine name, dose/strength, timing, prescriber, and notes. | 8 | record-workflow |
| Preserves a dated change history when medicines are added, edited, or stopped. | 12 | record-workflow |
| Records the card owner, person keeping the card, confirmation date, and confirmed by. | 13 | record-workflow |
| Produces a large-type, one-page print/PDF handoff card. | 7 | print-card |
| Stores health data locally in IndexedDB; there is no health-data account or cloud copy. | 14 | local-record, no-account-or-cloud-copy; storage detail also needs F-5-3 coverage |
| Exports and restores a portable plain JSON backup. | 8 | json-backup |
| Downloaded JSON can be opened as text. | 7 | plain-json-readable |
| Works offline after the first visit. | 6 | offline-reload |
| Offers an optional $12 one-time license for passphrase-protected backups. | 9 | encrypted-backup, checkout-available |
| The card, print view, and plain JSON backup are free. | 10 | core-features-free |
| Includes light and dark themes, reduced-motion behavior, medicine dialogs that keep Tab focus inside, and a responsive 390 px phone layout. | 21 | adaptive-interface, dialog-keyboard |
| Open the demo for Evelyn Parker's three-medicine card. | 8 | Clear demo link |
| Demo data uses a separate local database named demo:medication-handoff-card. | 9 | demo-isolation |
| The persistent demo banner can reset it or start a separate real card without copying the sample. | 17 | demo-isolation |
| Leaving the demo discards any sample edits. | 7 | demo-isolation |
| Requires Node.js 20 or newer. | 5 | Development requirement |
| Vite prints the local development URL. | 6 | Development instruction |
| Production service-worker registration is intentionally disabled during npm run dev. | 10 | Verified configuration note |
| Playwright 1.58.2 is pinned. | 4 | Verified configuration note |
| The factory image includes its Chromium build at PLAYWRIGHT_BROWSERS_PATH; elsewhere, run npx playwright install chromium once. | 16 | Setup instruction |
| Each public product claim has a tagged regression test declared in .factory/claims.json. | 12 | **F-5-1:** false while the live legal claims above remain undeclared |
| Every exact command includes its own clean dependency install, so it also runs from a fresh clone. | 17 | Confirmed |
| The static deploy artifact is dist/, with dist/index.html at its root. | 11 | Build confirmed |
| No runtime environment variables are required. | 6 | Build configuration |
| staticwebapp.config.json ships the enforced CSP, immutable hashed-asset caching, manifest MIME type, SPA routes, and the designed 404 response for static deployment. | 21 | Build configuration |
| Medication data stays in the browser unless the user downloads a backup. | 12 | local-record |
| Plain .json backups can be opened as text. | 8 | plain-json-readable |
| Store an encrypted-backup passphrase somewhere safe. | 6 | Useful instruction |
| Checkout starts at the Sociobot billing API and redirects to Dodo. | 10 | checkout-available |
| The live product is registered at $12. | 7 | checkout-available |
| License checks send the token and product name, not card details. | 11 | license-verification-data |
| A revoked result locks encrypted backups again. | 7 | revoked-license-lock |
| Returned licenses are stored as sb_license:medication-handoff-card. | 6 | Implementation documentation; storage inventory requires F-5-3 coverage |
| MIT. | 1 | License declaration |
| See LICENSE. | 2 | License pointer |

README headings—**What it does**, **Try the sample card**, **Local development**, **Test and build**, **Data and licensing**, **Project map**, and **License**—name their sections. Its product vocabulary is consistent: *handoff card*, *medicine*, *card owner*, *person keeping the card*, *demo*, and *backup*.

## Demo and sandbox behaviour

**PASS.** From a new 390 px browser context, the visible home action opened /?demo=1 in one click. Its first screen included the persistent banner, **Reset demo**, **Start for real**, Evelyn Parker, confirmation details, Lisinopril, dose, timing, prescriber, and Edit. Lisinopril occupied y=443–466 of the 844 px viewport; on desktop it occupied y=226–253 of the 1000 px viewport.

The fresh demo opened demo:medication-handoff-card. Editing its Lisinopril note, waiting for the change, and pressing **Reset demo** restored “Take as listed on the pharmacy label.” **Start for real** then reached the empty real-card form at /; the visible real route had no Evelyn Parker heading. The normal demo edit made requests only to the product origin (document, hashed JavaScript, CSS, and its self-hosted image). A fresh context loaded /demo, activated its service worker, was set offline, and reloaded with Evelyn Parker and the Offline banner visible.

## Claims contract

**PASS for the 17 declared claims.** Every literal test command from .factory/claims.json ran in sequence from fresh clone /tmp/mhc-review5-pxJRc0/repo; each command began with its own clean npm ci --ignore-scripts --no-audit --no-fund. The final Playwright status was passed with no failed tests.

| Claim ID | Result |
| --- | --- |
| demo-isolation | PASS |
| local-record | PASS |
| offline-reload | PASS |
| json-backup | PASS |
| full-history-backup | PASS |
| print-card | PASS |
| dialog-keyboard | PASS |
| encrypted-backup | PASS |
| license-verification-data | PASS |
| revoked-license-lock | PASS |
| record-workflow | PASS |
| adaptive-interface | PASS |
| checkout-available | PASS |
| core-features-free | PASS |
| non-clinical-scope | PASS |
| no-account-or-cloud-copy | PASS |
| plain-json-readable | PASS |

These passes do not clear F-5-1 through F-5-3 because the relevant extra legal-page promises are not what the declared tests assert.

## Earlier findings and structural checks

Every earlier finding was checked on the live site and in the source; none is regressed.

| Earlier ID(s) | Result |
| --- | --- |
| F-1-1 | PASS — Privacy navigation and Back focus the route h1 and update the polite announcer. |
| F-1-2 | PASS — Home, Demo, Privacy, and Terms have route-specific title, description, canonical, OG, and Twitter metadata. |
| F-1-3 to F-1-7 | PASS — free/paid, record-only, no-account, readable backup, and dialog promises have declared tests; unsupported provider/passphrase copy remains absent. |
| F-1-8 | PASS — the concrete **Change history** and **Privacy** wording and consistent card-owner terms remain. |
| F-2-1 | PASS — sample data is visible above the fold after one click at both widths. |
| F-2-2 | PASS — /review5-missing returned HTTP 404 with a styled shell, metadata, favicon, header, footer, Privacy, Terms, and return link. |
| F-3-1 to F-3-3 | PASS — medicine actions have target-specific accessible names; backup and theme controls name the result. |
| F-4-1 to F-4-3 | PASS — the observed license request, Sociobot-to-Dodo redirect, and revoked-license lock each have a declared test; former merchant/refund copy remains absent. |

The current site has one h1 and one main landmark per tested route; lang=en, description, canonical, OG/Twitter metadata, favicon, 180 px touch icon, robots, sitemap, and the designed 404 are present. Internal links (/, /demo, /privacy, /terms, and ?demo=1) returned 200; the checkout returned its expected 303 to Dodo, and the source repository returned 200. The header/footer are consistent across real routes. Deep links, Back, scroll/focus restoration, and route announcements passed. The paper/ink/coral document treatment and original kitchen-table image match design.md and are not a generic SaaS template.

CI=1 npm test passed: 10 Vitest checks and 74 Playwright checks. npm run build passed and regenerated dist/ (the built index.html timestamp was 2026-08-30 03:40:53 UTC). The deployed hashed JavaScript filename matched the local production build. No console error occurred on a normal live route.

## Missed leverage

**No finding.** The brief implies a local, printable, dated record with backup and restore, not clinical advice. The product already supplies JSON import/export, one-page print/PDF, optional encrypted export, and offline operation. An AI feature would invite unsafe medical interpretation and is not needed for this job.

## What would make this perfect

Add the three narrowly scoped claim tests (or remove/narrow the unprovable sentences), then rerun the clean-clone claim commands and the live privacy, Terms, demo, and 404 checks. With the legal claims brought to the same evidence standard as the rest of the product, no other issue was found.

