# Polish 1 — review finding closure

**Candidate repaired:** `cbeeb7363fa3cacd867dd3e0eef34f06918df805`  
**Repair commits:** `14020a6`, `865abe3`  
**Live URL:** <https://medication-handoff-card.sociobot.in>

All findings from [review-1.md](review-1.md) are closed. The current live screenshots are [desktop home](evidence/polish-1-live/screenshot-desktop-home.png) and [mobile demo](evidence/polish-1-live/screenshot-mobile-demo.png).

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Added History API navigation, Back/Forward scroll restoration, `tabindex="-1"` route headings, focused route headings, and a persistent polite route announcer. | Playwright `updates route focus, announcements, and metadata for navigation and Back`; live `/` → `/privacy` → Back check focused both h1s and announced “Privacy page”; desktop screenshot above. |
| F-1-2 | Added route-specific title, canonical, description, OG title/description, and Twitter title/description for `/`, `/demo`/`?demo=1`, `/privacy`, and `/terms`. | Same Playwright route test; cold live checks of `/demo`, `/privacy`, and `/terms`; live browser observed `https://medication-handoff-card.sociobot.in/privacy` canonical on Privacy. |
| F-1-3 | Rewrote the price fact in plain words and added the `core-features-free` claim. Card, print, and JSON backup are demonstrably usable without a license; encrypted backup is visibly $12 once. | `@claim:core-features-free` and `@claim:checkout-available`, clean-clone pass; live home and mobile-demo screenshots. |
| F-1-4 | Added the `non-clinical-scope` claim/test. The record-only editor and print safety wording make the communication-only boundary explicit. | `@claim:non-clinical-scope`, clean-clone pass; live `?demo=1` check and mobile screenshot show the safety note. |
| F-1-5 | Added the `no-account-or-cloud-copy` claim/test. It records every demo-edit request and asserts the visible UI has no sign-in, account, or sync action. | `@claim:no-account-or-cloud-copy`, clean-clone pass; live demo request/interaction check. |
| F-1-6 | Added the `plain-json-readable` claim/test, which opens the downloaded JSON text and checks Evelyn Parker and Lisinopril. Removed the untestable “passphrase is never stored and cannot be recovered” promise; copy now tells people to store it safely. | `@claim:plain-json-readable`, clean-clone pass; README/Privacy copy review. |
| F-1-7 | Retained the direct native-dialog keyboard assertion as `@claim:dialog-keyboard` and rewrote the README to say what it proves. Removed the payment-provider-ID implementation claim. | `@claim:dialog-keyboard`, clean-clone pass; full Playwright dialog-focus check. |
| F-1-8 | Replaced “Accountability” with “Change history” and “Private by default” with “Privacy”; aligned README wording to card owner, person keeping the card, confirmation date, and confirmed by. | `shows required landing sections and product identity metadata`; live screenshots and `.factory/copy-audit.md`. |

Earlier review/verification findings were also rechecked by the 52-test full suite: isolation, offline reload, encrypted/plain backups, print/PDF, validation/recovery, checkout, 404, dark contrast, dialog focus, target size, maximum-length mobile wrapping, and blocked-worker degradation all pass.

## Live evidence

- `verify-url.sh` live Home and `?demo=1`: both HTTP 200, zero console errors, title/lang/main/alt/button checks pass.
- `/polish-1-missing`: designed 404, HTTP 404.
- Live demo: edited Lisinopril, reset sample, exited to a real empty card, then reopened demo and found the original pharmacy-label note.
- Lighthouse report: 100/100/100/100, LCP 1394.511 ms, CLS 0.
