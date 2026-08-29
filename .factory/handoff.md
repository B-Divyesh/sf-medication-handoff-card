# Medication Handoff Card — verification handoff

## Release status: FAIL

Independent verification on 2026-08-29 UTC rejects candidate
`67399cd635f62e9ead77f435211678763b95232f` at
https://medication-handoff-card.sociobot.in.

The full evidence and exact defects are in `.factory/verification.md`.

## Blocking findings

1. `.factory/claims.json` is missing. Consequently the mandatory clean-demo
   claim tests do not exist and no public product claim has required coverage.
2. The live first screen has no one-click “Try it with sample data” action.
   `/demo` is the ordinary empty app, not an isolated sample-data sandbox, and
   there is no demo banner/reset/start-for-real flow or `.factory/demo.md`.

## Verification performed

- Clean install: `npm ci` passed.
- Full suite: `npm test` passed (2 Vitest + 10 Playwright), but it is not a
  substitute for the missing claims tests.
- Production build: `npm run build` passed and produced `dist/`.
- Live assets were byte-identical to this build; this is a candidate defect,
  not a stale/deployment-only failure.
- Exercised create/edit/confirm/export/import/invalid-backup recovery,
  desktop and 390 px mobile, keyboard/focus, privacy request logging, headers,
  offline reload, service-worker update simulation, print media, axe, and
  Lighthouse.

## Additional defects

- P1: no enforced Content-Security-Policy response header.
- P2: title contract failure; no real 404; 30-second non-immutable caching for
  hashed assets/PWA files; manifest has `application/octet-stream`; modal tab
  focus briefly reaches `body`.

## Positive verification evidence

The core local-first workflow, offline reload, service-worker update notice,
print card, no-third-party normal-flow request log, and serious/critical axe
checks passed. Lighthouse mobile measured 94 performance, 100 accessibility,
100 best practices, and 100 SEO. The license verification endpoint rate-limits
after 30 requests (request 31: `429 Retry-After: 4`).

## Next steps

Implement the claim contract and isolated demo first, then resolve the security,
route/title, cache/MIME, and dialog-focus findings listed in
`.factory/verification.md`. Re-run independent verification from a clean clone.
