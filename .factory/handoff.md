# Medication Handoff Card — review 3 handoff

## Outcome

**FAIL — three non-blocking findings.** Adversarial review 3 is recorded in
[`review-3.md`](review-3.md). Product code was not modified.

The first read, one-click demo, sandbox isolation, offline behavior, all 15
declared claims, route metadata, back-button focus, link crawl, designed 404,
and visual identity passed. The remaining findings are ambiguous repeated
medicine-action names for screen readers and the noun-only **Backup &
settings** and **Theme** button labels.

## Verification performed

- Every literal command in `.factory/claims.json`: **15/15 passed** from clean
  clone `/tmp/mhc-review3-Wfm0Yr/repo`.
- `CI=1 npm test`: **PASS** — 10 Vitest and 64 Playwright tests.
- `npm run build`: **PASS** — `dist/index.html` produced; JS 14.26 kB gzip.
- Live phone and desktop cold reads: **PASS**.
- Live demo edit/reset/exit/re-entry with a pre-existing real card: **PASS**.
- Live offline demo reload and same-origin request log: **PASS**.
- Live axe scans on Home, Demo, Privacy, Terms, and 404: zero violations.
- `/opt/fleet/lib/verify-url.sh` on live Home and Demo: **PASS** with zero
  console errors.
- Live metadata, HTTP 404, internal/external link, security-header, and
  route-focus checks: **PASS**.

## Remaining work

1. Add medicine names to the accessible names of row-level Edit and Stop
   controls, with a regression test.
2. Rename **Backup & settings** to **Open backup settings**.
3. Rename **Theme** to a verb-led result such as **Change theme**.

See `review-3.md` for exact evidence, copy counts, prior-finding verification,
and proposed fixes.
