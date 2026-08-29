# Adversarial first-read review 1 — FAIL

**Reviewed:** 2026-08-29 UTC  
**Live URL:** <https://medication-handoff-card.sociobot.in>  
**Viewports:** fresh Chromium contexts at 390 × 844 and 1440 × 1000

## Verdict

**FAIL.** The core first read, sample demo, functional workflow, and declared
claim tests are good. Acceptance nevertheless requires zero findings. The live
site leaves keyboard and screen-reader users at the document body after a route
change, publishes home-page metadata for the Demo/Privacy/Terms routes, and
makes several public promises without a `claims.json` entry and observable
test.

### Findings

#### F-1-1 — P2: Route changes do not move focus or announce the new page

**Location:** live `/` → `/privacy`, browser Back; `src/main.ts` `render()`.

After activating the visible **Privacy** link, the live browser reported
`document.activeElement === BODY`; the Privacy `<h1>` has no `tabindex`, and
there is no populated `aria-live` route announcement. Back to `/` has the same
result. This leaves a keyboard or screen-reader visitor without a dependable
starting point on the new page, contrary to the route-change requirement.

**Fix:** Make the route `<h1 tabindex="-1">`, focus it after every navigation
and `popstate`, preserve/restore scroll as appropriate, and write a short
announcement such as “Privacy page” to a persistent polite live region. Add a
Playwright test that activates Privacy, uses Back, and asserts focus and the
announcement on both route changes.

#### F-1-2 — P2: Demo and legal routes retain the home page’s canonical and social metadata

**Location:** live `/demo`, `/privacy`, `/terms`; `index.html`; `src/main.ts`
`render()`.

All three live routes have the home values:

| Route | Canonical actually served | Description actually served |
| --- | --- | --- |
| `/demo` | `https://medication-handoff-card.sociobot.in/` | “Make a clear, dated medication handoff card for family and clinicians.” |
| `/privacy` | `https://medication-handoff-card.sociobot.in/` | same home description |
| `/terms` | `https://medication-handoff-card.sociobot.in/` | same home description |

Their Open Graph title is also the home title. A visitor who shares a legal or
demo URL gets misleading page identity, and search engines are explicitly told
the legal/demo pages are copies of home.

**Fix:** On every route, set route-specific canonical, description, OG title,
OG description, and Twitter title/description. For example, set Demo canonical
to `/demo` and description to “Try a completed sample medication handoff card;
sample changes never reach your real card.” Add browser tests for all routes.

#### F-1-3 — P2: Pricing and free-feature claims are not all listed and tested

**Location:** landing page, footer, README; `.factory/claims.json`.

The following visitor-facing statements have no matching claim entry that
tests the quoted promise. A nearby functional claim is not enough: for example,
`local-record` observes same-origin requests but does not prove “no account,”
and `checkout-available` does not prove a feature is free.

| Unlisted claim-like copy | Location | Concrete remedy |
| --- | --- | --- |
| F-1-3: “Core card free; encrypted backups cost $12 once.” | home fact | Add a claim/test that asserts which controls are usable before checkout and the exact price, or remove “Core card free.” |
| F-1-4: “Communication tool, not medical advice.” / “No interaction checks or dose recommendations.” / “This tool records what you enter; it does not check whether a medicine or dose is right.” | home safety note; empty state | Add a safety-scope regression test covering the stated non-clinical boundary, or keep only an unambiguous disclosure that is documented as a non-functional limitation. |
| F-1-5: “There is no health-data account or cloud copy.” | home privacy section | Add a test that verifies no sign-up/account route or record upload endpoint exists, in addition to the request-log test. |
| F-1-3: “Encrypted backups are the only paid feature.” / “The card, print view, and plain JSON backup stay free.” | home paid section; README | Add a claim test that completes all three flows without a license, or state only the tested $12 encrypted-backup price. |
| F-1-6: “Plain `.json` backups are readable.” / “Paid `.mhc` backups use a passphrase that is never stored and cannot be recovered.” | README | Add a backup test that reads the downloaded file, inspects persistent storage, and verifies recovery is unavailable; otherwise remove those portions. |
| F-1-7: “There is no hard-coded payment-provider product ID in the app.” / “Includes … keyboard-ready native dialogs …” | README | Remove implementation detail; add a direct native-dialog keyboard assertion or rewrite to the tested behavior. |

#### F-1-4 — P2: Safety-scope claims are unlisted

**Location:** home safety note and empty state; README opening disclaimer.

The exact non-clinical claims are identified in the F-1-3 evidence table. They
are important reliance claims for a medication product, but no claim entry
tests that the app does not perform interaction/dose correctness checks.

**Fix:** Add a tagged safety-scope test that verifies the stated limited fields
and no recommendation/checking flow, or change the copy to a documented
non-functional disclosure and explicitly exempt it from the product-claim
catalogue policy.

#### F-1-5 — P2: “No account or cloud copy” exceeds the privacy test

**Location:** home privacy section; README What it does.

`local-record` records same-origin demo requests. That is good evidence that
the sample edit did not leave the device, but it does not establish the broader
quote that no account or cloud copy exists.

**Fix:** Add the concrete no-account/no-record-upload assertion described in
the F-1-3 evidence table, or narrow the sentence to the observable request-log
claim.

#### F-1-6 — P2: Backup readability, passphrase storage, and recovery claims are unlisted

**Location:** README Data and licensing.

The encrypted-backup claim proves an encrypted sample download. It does not
prove that plain files are readable, that a passphrase is never stored, or that
it cannot be recovered.

**Fix:** Add tests for each observable property or remove those promises; the
specific test scope is listed in the F-1-3 evidence table.

#### F-1-7 — P3: README makes unsupported or low-value implementation claims

**Location:** README What it does and Data and licensing.

“Keyboard-ready native dialogs” has no direct claim test, and “There is no
hard-coded payment-provider product ID in the app” is implementation detail a
visitor cannot use.

**Fix:** Add the direct dialog test and plain result wording, then delete the
product-ID sentence from the public README.

#### F-1-8 — P3: Two headings are abstract, and one README term is inconsistent

**Location:** home eyebrow headings; README What it does.

“Accountability” does not identify its section; use **Change history**.
“Private by default” is a slogan; use **Privacy**. README’s “keeper” and
“confirmer” differ from the app’s “Person keeping this card” and “Confirmed
by.”

**Fix:** Apply those exact heading rewrites and use “card owner, person keeping
the card, confirmation date, and confirmed by” in README.

## First read

**PASS.** Before scrolling on both fresh viewports, the product answered all
three required questions:

| Question | What a cold visitor can answer from the first screen |
| --- | --- |
| What does this do? | “Make a clear medication handoff card.” |
| For whom? | “For adult children, caregivers, and older adults sharing a checked list with family or clinicians.” |
| What should I click first? | “Try it with sample data”; it says “See a completed card for Evelyn Parker.” |

The primary action is visible at 390 px without scrolling. The first screen
also gives three plain facts, including the exact $12 one-time price. No
blocking first-read finding.

## Demo and sandbox

**PASS.** A fresh `/demo` context immediately showed Evelyn Parker, three
realistic medicines (Lisinopril, Metformin ER, Vitamin D3), dated changes, and
the persistent banner:

> “Demo — sample data, nothing is saved to your real card. Try editing Evelyn
> Parker’s example list.”

The banner provides **Reset demo** and **Start for real**. A live check edited
the Lisinopril note, waited for Reset to finish, and confirmed the original
note returned. A second edit followed by Start for real returned to an existing
real Ruth Reviewer card; reopening `/demo` showed the original sample note.
The two IndexedDB names were `medication-handoff-card` and
`demo:medication-handoff-card`; the application selects the namespace before
its first database read (`src/db.ts`).

The request log for normal and demo edit flows contained only
`https://medication-handoff-card.sociobot.in` documents/assets. There was no
analytics, CDN font, or health-data request. Offline reload is covered by the
declared test below. No demo or privacy blocking finding.

## Claims contract

**PASS for the ten declared claims.** Each literal command in
`.factory/claims.json` was run after its own clean
`npm ci --ignore-scripts --no-audit --no-fund`; all exited successfully in the
desktop and mobile Playwright projects.

| Claim ID | Result |
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

`npm test` also passed (8 Vitest, 42 Playwright) and `npm run build` produced
`dist/index.html`. These passing tests do not clear F-1-3’s unlisted promises.

## Copy audit

Word counts treat numbers and hyphenated terms as one word. Labels and button
text are included separately because they are user-facing copy. No landing
sentence exceeds 22 words. The landing has no vague primary button; **Try it
with sample data**, **Save names**, **Add first medicine**, **Download JSON**,
and **Buy encrypted backups — $12** name their results.

### Landing prose

| Copy | Words | Result |
| --- | ---: | --- |
| A dated list for the next handoff | 7 | Pass |
| Make a clear medication handoff card. | 6 | Pass |
| For adult children, caregivers, and older adults sharing a checked list with family or clinicians. | 14 | Pass |
| See a completed card for Evelyn Parker. | 7 | Pass |
| Records stay in this browser. | 5 | Claimed; listed |
| Works offline after the first visit. | 7 | Claimed; listed |
| Core card free; encrypted backups cost $12 once. | 8 | Flag F-1-3 |
| Communication tool, not medical advice. | 5 | Flag F-1-4 |
| No interaction checks or dose recommendations. | 6 | Flag F-1-4 |
| Confirm every change with a qualified clinician or pharmacist. | 9 | Pass safety instruction |
| Whose medicines are these? | 4 | Pass |
| You, a relative, or the card owner | 7 | Pass |
| No medicines on this card yet | 6 | Pass |
| Add exactly what is written on the label. | 8 | Pass |
| This tool records what you enter; it does not check whether a medicine or dose is right. | 17 | Flag F-1-4 |
| Changes will appear here automatically when you add, edit, or stop a medicine. | 13 | Claimed by record workflow |
| Copy each medicine, dose, timing, and prescriber from a trusted source. | 11 | Pass instruction |
| Confirm the current list and keep dated changes. | 8 | Claimed by record workflow |
| Print one page or download a JSON backup. | 8 | Claimed; listed |
| There is no health-data account or cloud copy. | 8 | Flag F-1-5 |
| You choose when to print or download a backup. | 9 | Pass |
| Encrypted backups are the only paid feature. | 7 | Flag F-1-3 |
| The card, print view, and plain JSON backup stay free. | 10 | Flag F-1-3 |
| Your health record stays in this browser during normal use. | 10 | Claimed; listed |
| Scene generated for this product; no person or brand is depicted. | 11 | Pass provenance |

### Landing labels and headings

| Copy | Words | Result |
| --- | ---: | --- |
| Medication Handoff Card | 3 | Pass wordmark |
| Try demo | 2 | Pass result-naming link |
| Privacy | 1 | Pass |
| Print / PDF | 2 | Pass |
| Backup & settings | 3 | Pass |
| Try it with sample data | 5 | Pass primary action |
| Card owner | 2 | Pass |
| Person’s name | 2 | Pass |
| Person keeping this card | 4 | Pass |
| Save names | 2 | Pass |
| Current list · 0 | 3 | Pass |
| Medicines being taken | 3 | Pass |
| Start with the current list | 5 | Pass |
| Add first medicine | 3 | Pass |
| Accountability | 1 | Flag F-1-8: rewrite “Change history.” |
| What changed | 2 | Pass |
| Three steps | 2 | Pass |
| How it works | 3 | Pass |
| Record the list | 3 | Pass |
| Check the handoff | 3 | Pass |
| Share a copy | 3 | Pass |
| Private by default | 3 | Flag F-1-8: rewrite “Privacy.” |
| Your record stays on this device | 6 | Pass |
| Read the privacy details | 4 | Pass result-naming link |
| Optional · $12 once | 3 | Pass |
| Protect backups with a passphrase | 6 | Pass |
| Buy encrypted backups — $12 | 5 | Pass result-naming link |
| Terms | 1 | Pass |
| Source (external) | 2 | Pass |

The two heading flags are F-1-8; their concrete rewrites are above.

### README prose

| Sentence or bullet sentence | Words | Result |
| --- | ---: | --- |
| Medication Handoff Card helps adult children, caregivers, and older adults make a clear, dated medication handoff card for family or clinicians. | 20 | Pass |
| It keeps the current list, who confirmed it, and what changed together. | 12 | Pass |
| This is a communication tool, not medical advice. | 8 | Flag F-1-4 |
| It does not check drug interactions, recommend doses, dispense medicines, order refills, or send alerts. | 14 | Flag F-1-4 |
| Medication decisions must be confirmed with a qualified clinician or pharmacist. | 10 | Pass safety instruction |
| Records medicine name, dose/strength, timing, prescriber, and notes. | 8 | Claimed by record workflow |
| Preserves a dated change history when medicines are added, edited, or stopped. | 12 | Claimed by record workflow |
| Records the card owner, keeper, last confirmation date, and confirmer. | 10 | Flag F-1-8: use “card owner, person keeping the card, confirmation date, and confirmed by.” |
| Produces a large-type, one-page print/PDF handoff card. | 7 | Claimed by print card |
| Stores all health data locally in IndexedDB; there is no account or cloud copy. | 13 | Flag F-1-5 (no-account portion) |
| Exports and restores a portable plain JSON backup for free. | 10 | Flag F-1-3 (free portion) |
| Works after the network disappears via a versioned service-worker cache. | 10 | Claimed, but rewrite for plain words: “Works offline after the first visit.” |
| Offers an optional $12 one-time license for passphrase-protected backups. | 10 | Claimed by checkout/encrypted backup |
| The core record, print flow, and plain export stay free. | 10 | Flag F-1-3 |
| Includes light and dark themes, reduced-motion behavior, keyboard-ready native dialogs, and a responsive 390 px phone layout. | 13 | Flag F-1-7; “keyboard-ready” is vague |
| Open the demo for Evelyn Parker's three-medicine card. | 9 | Pass |
| Demo data uses a separate local database named `demo:medication-handoff-card`. | 7 | Pass technical documentation |
| The persistent demo banner can reset it or start a separate real card without copying the sample. | 15 | Claimed by demo isolation |
| Leaving the demo discards any sample edits. | 6 | Claimed by demo isolation |
| Requires Node.js 20 or newer. | 5 | Pass |
| Vite prints the local development URL. | 6 | Pass |
| Production service-worker registration is intentionally disabled during `npm run dev`. | 8 | Pass technical documentation |
| Playwright 1.58.2 is pinned. | 4 | Pass |
| The factory image includes its Chromium build at `$PLAYWRIGHT_BROWSERS_PATH`; elsewhere, run `npx playwright install chromium` once. | 15 | Pass technical documentation |
| Each public product claim has a tagged regression test declared in `.factory/claims.json`. | 11 | Flag F-1-3 until the unlisted claims are resolved |
| Every exact command includes its own clean dependency install, so it also runs from a fresh clone. | 17 | Pass |
| The static deploy artifact is `dist/`, with `dist/index.html` at its root. | 10 | Pass |
| No runtime environment variables are required. | 5 | Pass technical documentation |
| `staticwebapp.config.json` ships the enforced CSP, immutable hashed-asset caching, manifest MIME type, SPA routes, and the designed 404 response for static deployment. | 18 | Pass technical documentation |
| Medication data stays in the browser unless the user downloads a backup. | 11 | Claimed by local record |
| Plain `.json` backups are readable. | 5 | Flag F-1-6 |
| Paid `.mhc` backups use a passphrase that is never stored and cannot be recovered. | 14 | Flag F-1-6 |
| The paid flow uses only the Sociobot billing API. | 9 | Claimed by checkout available |
| The live product is registered at $12. | 7 | Claimed by checkout available |
| The checkout link is derived from the product slug, and returned licenses are stored as `sb_license:medication-handoff-card`. | 14 | Pass implementation documentation |
| There is no hard-coded payment-provider product ID in the app. | 10 | Flag F-1-7 or remove |

README headings are descriptive. The terminology row flagged above is the only
inconsistent naming found: the app says “Person keeping this card” and
“Confirmed by,” while README switches to “keeper” and “confirmer.”

## Structure, links, and history

| Check | Result |
| --- | --- |
| One h1, `lang`, `<main>`, title pattern | Pass on `/`, `/demo`, `/privacy`, `/terms`, and 404 |
| Meta description, canonical, OG/Twitter | Fail on non-home routes: F-1-2 |
| Favicon, apple icon, social image, robots, sitemap | Pass |
| Designed HTTP 404 | Pass: `/missing-review-1` returned 404 and “That page is not here.” |
| Deep links and browser Back | URLs work; focus/announcement fail: F-1-1 |
| Header/footer, Privacy/Terms, skip link | Pass |
| Internal-link crawl | Pass: home/demo/privacy/terms 200; checkout 303 to Dodo; source 200 |
| Visual identity | Pass: warm paper, serif document type, coral annotation color, and original kitchen-table scene match the documented thesis; no generic gradient/card-template look |

No earlier `.factory/review-*.md` or `.factory/polish-*.md` exists. I read the
handoff and all three `verification*.md` reports anyway. The earlier reported
issues (missing claims/demo/CSP, wrong titles, 200 404, dialog trap, malformed
backup recovery, dark contrast, demo exit, small targets, overflow, and blocked
service-worker error) are fixed in the current live code and/or covered by the
passing current test suite. The two findings above are new checks that those
reports did not test.

## Missed leverage

No finding. The brief implies a local record, dated history, print/PDF, and
backup/restore; all are present. An AI medication recommendation or interaction
feature would be unsafe and is explicitly out of scope, so an AI gateway step
is not expected here.

## What would make this perfect

1. Fix F-1-1 with tested focus, announcement, and Back behavior.
2. Fix F-1-2 with route-specific canonical, description, and social metadata.
3. Resolve F-1-3 through F-1-7 by adding observable tagged tests or removing
   the unsupported wording; apply the F-1-8 heading and terminology rewrites
   at the same time.
