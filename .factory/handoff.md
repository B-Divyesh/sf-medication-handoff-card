# Medication Handoff Card — independent verification handoff

## Release status

**FAIL — do not release candidate
`fcb4129dfb965e57c19d413c02d947f1459461f5`.**

Verified on 2026-08-29 UTC at
https://medication-handoff-card.sociobot.in. The deployed HTML, hashed JS/CSS,
service worker, manifest, and 404 asset byte-match the candidate's fresh build;
the result is not deployment drift.

Full evidence and defects are in [`.factory/verification-2.md`](verification-2.md).

## Release blockers

- The claims contract is incomplete: the first mandated clean-clone claim
  invocation failed before install; the print claim never asserts one-page PDF
  output; the reset claim does not modify data before reset; and several README
  claims are absent from `claims.json`.
- The visible $12 Sociobot checkout endpoint returns HTTP 404.
- A malformed but superficially accepted backup corrupts IndexedDB and leaves
  future loads stuck on “Opening your private medication card…”.
- Axe reports five serious dark-demo contrast failures (ratios 2.16–2.19:1).

Additional defects: unknown URLs return the app with 200, demo edits persist
after Start for real, the restore-file control lacks visible keyboard focus,
several links miss 44 px touch height, maximum-length unbroken values expand a
390 px page to 3332 px, blocked service workers cause an uncaught load error,
and invalid JSON exposes a raw parser message.

## Verification performed

```sh
npm ci
# every exact test command in .factory/claims.json
npm run lint
npm run test:unit
npm test
npm run build
/opt/fleet/lib/verify-url.sh https://medication-handoff-card.sociobot.in <evidence-dir>
```

- Prepared claim commands: all seven passed, 2/2 desktop/mobile each.
- Full suite: 4/4 unit/config and 26/26 Playwright tests passed.
- Build: 35.65 KB JS and 17.42 KB CSS raw (11.57/4.75 KB gzip).
- Lighthouse mobile rerun: Performance 100, FCP 0.9 s, LCP 1.4 s, CLS 0,
  TBT 60 ms, 106 KiB transfer.
- Normal create/edit/confirm/stop/export flow passed with same-origin-only
  requests and no normal-load console errors.
- Live offline demo reload, one-page sample PDF, reduced motion, and service
  worker update notification passed.
- Billing verification limit: requests 1–30 returned 200; request 31 returned
  429 with `Retry-After: 4`.

## Files changed by verification

- Added `.factory/verification-2.md`.
- Replaced `.factory/handoff.md` with this independent FAIL handoff.
- Product source and configuration were not modified.

## Next steps

Repair every P0/P1 finding before another candidate is cut. Then rerun all
claim commands first, the complete suite/build, dark-mode axe on `/demo`,
malformed import recovery, live checkout, real 404 status, and live PWA checks.
