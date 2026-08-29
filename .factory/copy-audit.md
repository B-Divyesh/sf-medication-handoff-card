# Landing-page copy audit

Audited 2026-08-29. Labels and sentence fragments are included because users
rely on them even when they do not end in punctuation.

| Copy | Words | Result |
| --- | ---: | --- |
| A dated list for the next handoff | 7 | Pass |
| Make a clear medication handoff card. | 6 | Pass |
| For adult children, caregivers, and older adults sharing a checked list with family or clinicians. | 14 | Pass |
| Try it with sample data | 5 | Pass |
| See a completed card for Evelyn Parker. | 7 | Pass |
| Records stay in this browser. | 5 | Pass |
| Works offline after the first visit. | 7 | Pass |
| Card, print, and JSON backup are free; encrypted backups cost $12 once. | 12 | Pass · `core-features-free` |
| Communication tool, not medical advice. | 5 | Pass · `non-clinical-scope` |
| No interaction checks or dose recommendations. | 6 | Pass · `non-clinical-scope` |
| Confirm every change with a qualified clinician or pharmacist. | 9 | Pass |
| Whose medicines are these? | 4 | Pass |
| You, a relative, or the card owner | 7 | Pass |
| Start with the current list | 5 | Pass |
| No medicines on this card yet | 6 | Pass |
| Add exactly what is written on the label. | 8 | Pass |
| This tool records what you enter; it does not check whether a medicine or dose is right. | 17 | Pass |
| Changes will appear here automatically when you add, edit, or stop a medicine. | 13 | Pass |
| The 20 latest entries are shown. All history is included in backups. | 12 | Pass · `full-history-backup` |
| How it works | 3 | Pass |
| Copy each medicine, dose, timing, and prescriber from a trusted source. | 11 | Pass |
| Confirm the current list and keep dated changes. | 8 | Pass |
| Print one page or download a JSON backup. | 8 | Pass |
| Your record stays on this device | 6 | Pass |
| There is no health-data account or cloud copy. | 8 | Pass · `no-account-or-cloud-copy` |
| You choose when to print or download a backup. | 9 | Pass |
| Protect backups with a passphrase | 6 | Pass |
| Encrypted backup is the only paid feature. | 6 | Pass · `core-features-free` |
| The card, print view, and plain JSON backup are free. | 10 | Pass · `core-features-free` |
| Your health record stays in this browser during normal use. | 10 | Pass |
| Scene generated for this product; no person or brand is depicted. | 11 | Pass |
| Demo — sample data, nothing is saved to your real card. | 10 | Pass · `demo-isolation` |
| Try editing Evelyn Parker’s example list. | 6 | Pass |
| Sample medication handoff card | 4 | Pass |
| Confirmed Aug 28, 2026 by Jordan Parker. | 7 | Sample-specific record detail |
| Current medicine | 2 | Pass |
| Lisinopril | 1 | Sample-specific record detail |
| 10 mg · Each morning | 4 | Sample-specific record detail |
| Prescriber: Dr. Nina Shah | 4 | Sample-specific record detail |
| No medicines in this restored card | 7 | Empty restored-card state |

No sentence exceeds 22 words. No copy uses a banned marketing word.

## Terminology

| Concept | One term used |
| --- | --- |
| The printable record | handoff card |
| A medication entry | medicine |
| The person whose list it is | card owner |
| The person maintaining it | person keeping the card |
| The test-only record set | demo |
| A downloaded data copy | backup |
