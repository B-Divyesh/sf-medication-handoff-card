# Medication Handoff Card — repair handoff

## Release status

**Code repair pushed; static deployment pending the factory.** This repair addresses every
finding in independent verification report `6d9c643cb4584a2c82ac8e64025ebe4e8ccca087`
for candidate `67399cd635f62e9ead77f435211678763b95232f`.

## Repairs made

- Added `.factory/claims.json` with seven public claims and one exact tagged
  Playwright regression command for each.
- Added the one-click `/demo` and `?demo=1` sandbox. It seeds Evelyn Parker's
  realistic three-medicine card in IndexedDB database
  `demo:medication-handoff-card`, never opens the real-card database in demo
  mode, and has a persistent banner with Reset demo and Start for real.
- Rewrote the first screen with the caregiver/adult-child audience, clear
  handoff result, and visible **Try it with sample data** action. Route titles
  now follow the required home and demo contracts.
- Added `public/staticwebapp.config.json`: enforced restrictive CSP,
  `frame-ancestors` response-header policy, immutable cache policy for hashed
  assets, manifest MIME type, route fallback exclusions, and a designed 404
  response. Added self-hosted 404 and offline styles so the CSP causes no
  inline-style errors.
- Added a Tab focus trap, Escape handling, and focus return for native modal
  dialogs. Saving, stopping, confirming, restoring, and cancelling now return
  focus to the invoking control.
- Added `/demo` to the sitemap, bumped the PWA cache/start URL version, and
  documented the sample namespace in `.factory/demo.md`.

## Verification evidence

Performed in a clean dependency install on 2026-08-29 UTC:

| Check | Evidence |
| --- | --- |
| Clean install | `npm ci` completed; 0 vulnerabilities reported. |
| Type/lint | `npm run lint` passed (`tsc --noEmit`). |
| Unit/config | `npm run test:unit` passed: 4 tests, including CSP/cache/MIME/404 configuration regressions and encrypted-backup crypto tests. |
| Browser integration | `npm test` passed: 4 unit tests plus 26 Playwright checks. Desktop and exact 390×844 mobile passed core create/edit/confirm/stop/import/export/paid flow, all seven claim tests, service-worker-controlled offline reload, print media, titles, console clean load, and no horizontal overflow. |
| Accessibility | Axe via Playwright reported zero serious/critical findings for home, Privacy, and Terms on desktop and 390 px. Keyboard regression tabs forward and reverse inside the medicine dialog. |
| Privacy | The `@claim:local-record` demo edit request log contained only `http://127.0.0.1:4173` requests. No health record request is sent to a third party during normal use. |
| Offline/update | `@claim:offline-reload` waited for the service-worker controller, went offline, reloaded `/demo`, and retained Evelyn Parker's sample card plus offline banner. Shell version is `mhc-v3`; offline CSS is precached. |
| Production build | `npm run build` passed and produced `dist/` with root `index.html`. Main JS: 35.65 kB (11.57 kB gzip); CSS: 17.42 kB (4.75 kB gzip). |
| Browser smoke | `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 /tmp/mhc-verify` passed: title, `lang=en`, one h1, main landmark, image alt text, labelled buttons, and no console errors. |
| Lighthouse mobile | Local production preview: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.9 s, CLS 0. |

All claim commands are declared in `.factory/claims.json`, for example
`npm run test:e2e -- --grep @claim:offline-reload`.

## Run and deploy

```sh
npm ci
npm test
npm run build
```

Deploy `dist/` as the existing static PWA artifact. The included
`staticwebapp.config.json` is the deployment configuration and must be shipped
at the root of `dist/`; it supplies the production security, cache, MIME, and
404 policies.

## Known gaps

The repaired code commit is on `main` (`91b1a6b`), but the live URL still served the prior
artifact when checked after the push: `last-modified: Fri, 28 Aug 2026` and no
CSP header. GitHub's deployment and Actions APIs report no deployment workflow
or deployment record for this repository. This repository does not contain a
factory deployment credential or target configuration, and its `AGENTS.md`
prohibits direct infrastructure changes. The factory must publish `dist/` from
the pushed `main` revision; `staticwebapp.config.json` is included for that
deployment.

The optional paid-license verification depends on the documented Sociobot
billing endpoint; all free local-first workflows, demo behavior, and offline
use work without it.
