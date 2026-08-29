# Medication Handoff Card — polish 1 handoff

## Release status

**PASS.** The repair is deployed at <https://medication-handoff-card.sociobot.in> from application commit `865abe3` (`fix: version the repaired PWA shell`). The preceding repair commit is `14020a6` (`fix: complete routing and claim coverage`). Deployment `5dd6c7b8` completed successfully on 2026-08-29 UTC.

This round resolves every finding in [review-1.md](review-1.md), including its P2/P3 items. Earlier reports ([verification.md](verification.md), [verification-2.md](verification-2.md), and [verification-3.md](verification-3.md)) were read as required; their previous demo, claim, CSP, 404, validation, contrast, focus-trap, mobile, service-worker, and checkout findings remain covered by the current suite. There are no known open findings.

## What changed

- Made same-origin route links real History API transitions. Every transition and Back/Forward focuses the page `<h1>`, restores the saved scroll position, and announces the destination through a persistent polite live region.
- Added per-route title, canonical, description, Open Graph, and Twitter title and description for Home, Demo, Privacy, and Terms.
- Kept the one-click demo at `/?demo=1` as well as `/demo`; it uses the isolated `demo:medication-handoff-card` database, shows the persistent banner, resets Evelyn Parker’s sample, and discards sample edits on exit.
- Added five observable public claims (14 total) for free core features and price, the non-clinical boundary, no account/cloud copy, and readable JSON. Removed the untestable recovery/storage promise about encrypted passphrases.
- Rewrote the public headings and README terminology: **Change history**, **Privacy**, “person keeping the card”, and “confirmed by”. Removed the low-value payment-provider-ID wording.
- Advanced the service-worker cache from `mhc-v4` to `mhc-v5` so installed copies receive this repair.

## Verification evidence

| Gate | Result and evidence |
| --- | --- |
| Clean-clone claims | All 14 literal commands in `.factory/claims.json` passed from a fresh `git clone`; each self-installed dependencies and ran in desktop + 390 px projects (2/2 each, 28 browser executions). |
| Unit/type/build | `npm run lint` passed; `npm run test:unit` passed 8/8; `npm run build` produced `dist/index.html`. Final JS is 41.61 kB raw / 13.33 kB gzip and CSS is 19.03 kB raw / 5.05 kB gzip. |
| Full suite | `npm test` passed: 8 Vitest tests and 52 Playwright tests. It covers record workflow, restore validation, print PDF, offline reload, dialog trap, dark-mode axe, 390 px wrapping, worker failure, all 14 claims, metadata, and route focus/Back. |
| Accessibility | Local and live axe scans reported 0 serious/critical violations. `verify-url.sh` passed at local production and live Home/Demo: title, `lang=en`, one `<h1>`, main landmark, alt text, labelled buttons, and zero console errors. Live screenshots: [desktop home](evidence/polish-1-live/screenshot-desktop-home.png) and [mobile demo](evidence/polish-1-live/screenshot-mobile-demo.png). |
| Live route repair | Cold live browser check passed `/` → `/privacy` → Back with focused `<h1>`, “Privacy page” announcement, and correct route metadata. Direct `/demo`, `/privacy`, `/terms`, and `/?demo=1` each set their own title/canonical/description. Unknown `/polish-1-missing` returned the designed 404 with HTTP 404. |
| Live demo repair | Live `?demo=1` edit/reset/Start-for-real/reopen check restored the original Lisinopril note and never copied the sample into the real card. |
| PWA/offline | Full Playwright offline reload passed after the `mhc-v5` cache-version build. Live `/sw.js` serves `const VERSION = 'mhc-v5'`. |
| Lighthouse | Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1394.511 ms and CLS 0. Report: [lighthouse.json](evidence/polish-1-live/lighthouse.json). |

## Run and deploy

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh medication-handoff-card dist
```

No runtime secrets or environment variables are required. The artifact remains a static, local-first PWA; health records stay in browser storage unless the person downloads a backup.

## Known gaps and next steps

None. Future product work should preserve the existing claim-test contract and increment the service-worker cache version whenever the deployed shell changes.
