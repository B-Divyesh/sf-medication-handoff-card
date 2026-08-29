# Medication Handoff Card — repair handoff

## Release status

**PASS — repaired, committed, deployed, and live.**

This repair resolves every finding in verifier report commit
`0cb17b26a572079c8cbb6484b8c1ce2567203708` for candidate
`fcb4129dfb965e57c19d413c02d947f1459461f5`. The artifact remains a static,
local-first PWA at <https://medication-handoff-card.sociobot.in>.

## Repairs

- Made every exact claims command self-installing from a fresh clone. Expanded
  the manifest to ten public claims with exactly one tagged test each.
- Strengthened the print claim to generate an A4 PDF and assert one page.
  Strengthened demo reset to modify, reset, leave, and reopen the sandbox.
- Registered the live $12 one-time product in Dodo and the Sociobot factory
  product registry. The production checkout now redirects to a hosted session.
- Added deep validation for profiles, medicines, history, dates, field sizes,
  item limits, and duplicate IDs before any restore write. Invalid JSON now
  gives a recovery instruction. Existing unreadable local records show a
  confirmed reset path instead of trapping the app on its loading screen.
- Added dark-theme foreground tokens for success, warning, and danger surfaces.
  Populated dark demo axe checks now cover the original failures.
- Replaced the catch-all SPA fallback with explicit `/demo`, `/privacy`, and
  `/terms` rewrites. Unknown addresses now reach the designed 404 with status
  404.
- Clear demo IndexedDB before **Start for real**, add visible restore-file focus,
  enforce 44 px navigation targets, wrap maximum-length content, and tolerate
  missing or blocked service-worker registration.
- Added the required three-step, privacy, and paid sections plus the first-screen
  price fact. Added the authored SVG favicon, exact 180 px touch icon, and a
  1200 × 630 crop of the original generated scene for social previews.
- Removed deferred history rendering that left a large blank mobile region.
  Updated copy, demo, design, claims, and README documentation.

## Verification evidence

Performed 2026-08-29 UTC:

| Gate | Evidence |
| --- | --- |
| Clean dependency install | Repeated `npm ci --ignore-scripts --no-audit --no-fund` from every exact claims command; 60 packages installed each time. |
| Claims | All 10 `.factory/claims.json` commands passed on desktop and exact 390 × 844 mobile: 2/2 each. |
| Type/lint | `npm run lint` passed (`tsc --noEmit`). |
| Unit/config | `npm run test:unit` passed 8/8, including nested backup rejection, routing policy, CSP, metadata assets, crypto, and duplicate/date validation. |
| Full integration | `npm test` passed 8 unit/config tests and 42/42 Playwright checks across desktop and mobile. |
| Accessibility/keyboard | Light home/legal and populated dark demo axe scans reported zero serious/critical findings. Dialog Tab/Shift+Tab trap, Escape, return focus, visible file focus, and 44 px audited links passed. |
| Import safety | The verifier's `profile: {"id":"profile"}` fixture and invalid JSON were rejected before confirmation/write; the original demo survived reload. |
| Responsive | Maximum allowed unbroken medicine fields fit 390 px without horizontal overflow. Visual desktop, 390 px home, and dark-demo reviews passed. |
| Privacy | The live demo edit request log contained only `https://medication-handoff-card.sociobot.in`; no tracker, CDN font, or health-data request occurred. |
| Offline/PWA | Service-worker-controlled live `/demo` reloaded offline with Evelyn Parker and the Offline banner. `mhc-v4` versions caches; a blocked worker produced no page error and the app remained usable. |
| Production build | `npm run build` produced root `dist/index.html`; main JS 39.24 kB / 12.62 kB gzip and CSS 19.03 kB / 5.05 kB gzip. |
| Local URL smoke | `verify-url.sh` passed title, `lang=en`, one h1, main, alt text, button labels, and console checks; measured load 624 ms. |
| Lighthouse mobile | Local production build: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.8 s, CLS 0, TBT 0 ms, 108 KiB transfer. |
| Live routing | `/`, `/demo`, `/privacy`, and `/terms` returned 200. `/definitely-missing-qa-page` returned 404 with “That page is not here.” |
| Live checkout | Sociobot checkout returned 303 to `https://checkout.dodopayments.com/session/...`; the app's tagged claim checks the exact $12 link and redirect. |
| Response policy | Live CSP, HSTS, Referrer-Policy, X-Content-Type-Options, and Permissions-Policy are enforced. Hashed assets are immutable for one year; manifest is `application/manifest+json` with `no-cache`. |
| Live identity | Live index, hashed JS/CSS, service worker, manifest, favicon, touch icon, and social image byte-match `dist/` by SHA-256. Live `verify-url.sh` passed in 901 ms. |

Deployment used `/opt/fleet/lib/deploy-static.sh medication-handoff-card dist`
and completed as Azure Static Web Apps deployment
`1c77e60e-a651-4a3b-b302-35f4898f6fc6`.

## Run and verify

```sh
npm ci
npm run lint
npm run test:unit
npm test
npm run build
/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 <evidence-directory>
```

Run each exact `test` string in `.factory/claims.json` to repeat claim-specific
clean-clone verification.

## Known gaps

No release-blocking gaps remain. Verification did not place a real $12 charge;
it proved the live hosted checkout redirect and tested license return,
verification, encrypted export, and revoked/invalid behavior without spending.
