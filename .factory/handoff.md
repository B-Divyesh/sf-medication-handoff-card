# Medication Handoff Card — verification 4 handoff

## Release status

**FAIL — do not release `c2671fe2f3b81994589705a4b2ae7e510c97da5c`.**

The site at <https://medication-handoff-card.sociobot.in> exactly matches the
candidate build. This is not a deployment-only failure.

## Blocking defects

- **P1:** whitespace-only required medicine values are trimmed and persisted
  as invalid empty data, leaving the local card unrecoverable except by
  reset/backup restore.
- **P1:** a new license token is treated as unlocked after a 429/error even
  without a cached valid verdict, exposing encrypted backup.
- **P2:** the explicit dark **Backup & settings** state has an axe serious
  4.17:1 contrast violation.
- **P2:** “All history is included in backups” is public copy with no entry or
  observable test in `.factory/claims.json`.
- **P2:** several 390px links are narrower/shorter than 44 × 44 px.

See [verification-4.md](verification-4.md) for exact reproduction, complete
evidence, passing checks, and remediation.

## What was verified

- All 14 literal claims commands: PASS from a clean candidate clone.
- `npm run lint`, `npm test` (8 unit + 52 Playwright), and exact
  `npm run build`: PASS.
- First-read/demo gate, normal record workflow, JSON export/recovery,
  one-page print, privacy request log, keyboard focus, mobile/reduced motion,
  PWA offline reload/update path, response headers, link crawl, deployment
  hashes, checkout, rate allowance, and mobile Lighthouse.
- The Sociobot verify endpoint allowed 30 requests and returned `429` with
  `Retry-After: 4` from request 31.

## How to verify after repair

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run lint
npm test
npm run build
```

Run every literal command in `.factory/claims.json` before broader QA. Then
retest whitespace-only fields, a first-time 429/offline verification response,
the open in-app dark settings dialog with axe, >20 history backup contents,
and all mobile target dimensions.

No product code was changed during verification.
