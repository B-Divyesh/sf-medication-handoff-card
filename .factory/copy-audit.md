# Copy audit

Audited 2026-08-30 after polish round 4. Counts use whitespace-delimited
words; hyphenated terms and numbers count as one word. No sentence exceeds 22
words, and no copy uses a banned marketing word.

## First screen

| Copy | Words | Result |
| --- | ---: | --- |
| Medication Handoff Card | 3 | Product name |
| Try demo | 2 | Link names its destination |
| Privacy | 1 | Link names its destination |
| Print / PDF | 3 | Button names the action and result |
| Open backup settings | 3 | Button starts with a verb; F-3-2 closed |
| A dated list for the next handoff | 7 | Concrete context |
| Make a clear medication handoff card. | 6 | Verb-first job headline |
| For adult children, caregivers, and older adults sharing a checked list with family or clinicians. | 15 | Audience and changed outcome |
| Try it with sample data | 5 | Primary action |
| See a completed card for Evelyn Parker. | 7 | Explains the result of the action |
| Records stay in this browser. | 5 | `local-record` |
| Works offline after the first visit. | 6 | `offline-reload` |
| Card, print, and JSON backup are free; encrypted backups cost $12 once. | 12 | `core-features-free`, `checkout-available` |
| Communication tool, not medical advice. | 5 | `non-clinical-scope` |
| No interaction checks or dose recommendations. | 6 | `non-clinical-scope` |
| Confirm every change with a qualified clinician or pharmacist. | 9 | Safety instruction |

Read aloud, the first screen states the job, audience, sample action, storage,
offline behavior, exact free/paid boundary, and safety limit without needing a
second sentence to decode the headline.

## Product and landing sections

| Copy | Words | Result |
| --- | ---: | --- |
| Card owner | 2 | Concrete heading |
| Whose medicines are these? | 4 | Concrete heading |
| Person’s name | 2 | Field label |
| Person keeping this card | 4 | Field label |
| You, a relative, or the card owner | 7 | Field help |
| Save names | 2 | Result-naming button |
| Medicines being taken | 3 | Concrete heading |
| Start with the current list | 5 | Concrete instruction |
| No medicines on this card yet | 6 | Empty state |
| Add exactly what is written on the label. | 8 | Next step |
| This tool records what you enter; it does not check whether a medicine or dose is right. | 17 | `non-clinical-scope` |
| Add first medicine | 3 | Result-naming button |
| Change history | 2 | Concrete heading |
| What changed | 2 | Concrete heading |
| Changes will appear here automatically when you add, edit, or stop a medicine. | 13 | `record-workflow` |
| The 20 latest entries are shown. | 6 | `full-history-backup` |
| All history is included in backups. | 6 | `full-history-backup` |
| How it works | 3 | Concrete heading |
| Record the list. | 3 | Step action |
| Copy each medicine, dose, timing, and prescriber from a trusted source. | 11 | Step instruction |
| Check the handoff. | 3 | Step action |
| Confirm the current list and keep dated changes. | 8 | `record-workflow` |
| Share a copy. | 3 | Step action |
| Print one page or download a JSON backup. | 8 | `print-card`, `json-backup` |
| Privacy | 1 | Concrete heading |
| Your record stays on this device | 6 | Concrete heading |
| There is no health-data account or cloud copy. | 8 | `no-account-or-cloud-copy` |
| You choose when to print or download a backup. | 9 | Concrete description |
| Read the privacy details | 4 | Result-naming link |
| Protect backups with a passphrase | 5 | Concrete heading |
| Encrypted backup is the only paid feature. | 7 | `core-features-free` |
| The card, print view, and plain JSON backup are free. | 10 | `core-features-free` |
| Buy encrypted backups — $12 | 5 | Result and exact price |
| Your health record stays in this browser during normal use. | 10 | `local-record` |
| Scene generated for this product; no person or brand is depicted. | 11 | Asset provenance |

## Demo and repeated actions

| Copy | Words | Result |
| --- | ---: | --- |
| Demo — sample data, nothing is saved to your real card. | 10 | `demo-isolation` |
| Try editing Evelyn Parker’s example list. | 6 | Demo instruction |
| Reset demo | 2 | Result-naming button |
| Start for real | 3 | Result-naming link |
| Sample medication handoff card | 4 | Concrete label |
| Confirmed Aug 28, 2026 by Jordan Parker. | 7 | Sample record detail |
| Current medicine | 2 | Concrete label |
| Lisinopril | 1 | Sample record detail |
| 10 mg · Each morning | 4 | Sample record detail |
| Prescriber: Dr. Nina Shah | 4 | Sample record detail |
| Edit Lisinopril | 2 | Target-specific accessible name; F-3-1 closed |
| Stop and remove Lisinopril | 4 | Target-specific accessible name; F-3-1 closed |
| Edit Metformin ER | 3 | Target-specific accessible name; F-3-1 closed |
| Stop and remove Metformin ER | 5 | Target-specific accessible name; F-3-1 closed |
| Edit Vitamin D3 | 3 | Target-specific accessible name; F-3-1 closed |
| Stop and remove Vitamin D3 | 5 | Target-specific accessible name; F-3-1 closed |
| Add medicine | 2 | Result-naming button |
| Confirm current list | 3 | Result-naming button |

The short visible row labels remain “Edit” and “Stop & remove.” Their
accessible names include the target medicine, so button navigation is
unambiguous without making the compact phone layout harder to scan.

## Settings and legal-route controls

| Copy | Words | Result |
| --- | ---: | --- |
| Download JSON | 2 | Result-naming button |
| Restore a backup | 3 | Result-naming control |
| Unlock encrypted backups — $12 | 5 | Result and exact price |
| Verify license | 2 | Result-naming button |
| Use dark theme | 3 | Names the next result; F-3-3 closed |
| Use light theme | 3 | Names the next result; F-3-3 closed |
| Close settings | 2 | Result-naming button |

## License and legal copy

| Copy | Words | Result |
| --- | ---: | --- |
| When you verify a paid license, the app sends only the license token and product name to the Sociobot billing API. | 21 | `license-verification-data` |
| It sends no card details. | 5 | `license-verification-data` |
| Checkout starts at Sociobot and redirects to Dodo. | 8 | `checkout-available` |
| If license verification reports a revoked license, encrypted backups lock again. | 11 | `revoked-license-lock` |
| If verification reports a revoked license, encrypted backups lock again. | 10 | `revoked-license-lock` |

The earlier merchant-of-record, payment-privacy, and automatic refund-revocation
sentences were removed because this product cannot prove those policy claims in
its sandbox. The retained copy describes only observed requests and app state.

## Catalog description

“Build a clear, printable medication handoff card for family and clinician
visits.” starts with a verb and is 81 characters, including its period.

## Terminology

| Concept | One term used |
| --- | --- |
| Printable/current record | handoff card |
| Medication entry | medicine |
| Person whose record it is | card owner |
| Person maintaining it | person keeping the card |
| Isolated example data | demo |
| Downloaded data copy | backup |
