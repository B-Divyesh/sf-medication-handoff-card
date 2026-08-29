# Medication Handoff Card — review-2 handoff

## Release status

**FAIL — adversarial review 2, 2026-08-29 UTC.**

The reviewed candidate is `1668a00fcbf2b87e86d2e37f0f0680d9de119c64`
at <https://medication-handoff-card.sociobot.in>. No product code was changed
in this review; `.factory/review-2.md` records the evidence.

Live identity was verified: the live
`index-eTnJiOPs.js` SHA-256 is
`2412c9e1ef12c2f304cc9f145aad55985eb1c246d673e8f42c4a9e1fe5c31670`,
matching `dist/`; the live service worker is `mhc-v6` and the manifest starts
at `/?v=5`.

## What was verified

- Fresh live 390 × 844 and 1440 × 1000 first reads clearly stated the job,
  intended people, and initial action.
- Demo data, Reset demo, Start for real, namespace isolation, and same-origin
  request behaviour were checked live. Reset restores the original Lisinopril
  note and Start for real opens an empty real card.
- All 15 `claims.json` commands passed from their own clean dependency install.
- `CI=1 npm test` and `npm run build` passed. The build produces `dist/`.
- Live routes, metadata, focus/route announcements, headers, internal/external
  links, designed 404 response, visual identity, and earlier review findings
  were rechecked.

## Known gaps / required next steps

Two findings remain and prevent release acceptance:

1. **F-2-1 (BLOCKING):** `/demo` loads the sample but does not show its owner
   or any medicine above the fold. At 390 × 844, owner content begins at
   y=1,146 and Lisinopril at y=1,573. Replace the repeated demo masthead with
   a compact demo top section that shows the editable sample card immediately;
   add viewport assertions.
2. **F-2-2 (P2):** `public/404.html` has no description/canonical/OG/Twitter
   or favicon metadata and omits the consistent header/footer with Privacy and
   Terms. Add the route skeleton and a 404 browser test.

See [review-2.md](review-2.md) for complete evidence, copy audit, claims
table, prior-finding regression matrix, and exact fixes.

## How to run and verify

```sh
CI=1 npm test
npm run build
```

Open `/demo` for the isolated sample card. The complete claim contract and its
exact commands are in `.factory/claims.json`.
