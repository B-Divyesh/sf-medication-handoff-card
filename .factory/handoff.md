# Medication Handoff Card — polish round 5 handoff

## Outcome

**PASS — all findings from adversarial reviews 1–5 are closed, and the repair
is live.**

Round 5 adds direct claim coverage for shipped advertising/analytics code and
for the complete storage/deletion promise. The Privacy page no longer guesses
about hosting logs. Terms now states only the tested record-only boundary. All
earlier work remains intact: plain first-screen wording, one-click isolated
`?demo=1`, reset and real-card exit, per-route metadata and focus, HTTP 404,
legal links, responsive mobile layout, local persistence, offline reload,
one-page print/PDF, backup/restore, and paid encrypted export.

The existing kitchen-table paper, ink, coral, and serif visual identity is
unchanged. The artifact remains a static local-first PWA.

## Source and deployment

- Candidate repaired: `128edbfd6fc265032e162601baf2a2102cc1e687`.
- Review commit: `edd4b3b262e918ab3c0c98ec1a78a09740ea839e`.
- Product repair commit: `415f82b`.
- Branch: `main`; repair pushed to `origin/main`.
- Deploy command: `/opt/fleet/lib/deploy-static.sh medication-handoff-card dist`.
- Azure Static Web App: `sf-medication-handoff-card`, resource group `sociobot`.
- Deployment ID: `db0a8f1c-1ed8-4a46-95a8-a70a5fcb37da`.
- Default host: <https://delightful-water-039582310.7.azurestaticapps.net>.
- Production URL: <https://medication-handoff-card.sociobot.in>.
- Production bundles: `index-CPJ1U27j.js`, `index-D3mHgyMf.css`.
- Live/local JavaScript SHA-256:
  `51c87f98254600282e1899badd8bacc73f2e4689724050a807a0a3a92c8d5147`.

## Exact verification evidence

### Clean-clone claim contract

All 19 literal commands in `.factory/claims.json` passed from clean clone
`/tmp/mhc-polish5-claims-q7PND1/repo`. Each command performed its own
`npm ci --ignore-scripts --no-audit --no-fund`; each tagged test passed in the
desktop and 390×844 projects.

The IDs are `demo-isolation`, `local-record`, `offline-reload`, `json-backup`,
`full-history-backup`, `print-card`, `dialog-keyboard`, `encrypted-backup`,
`license-verification-data`, `revoked-license-lock`, `record-workflow`,
`adaptive-interface`, `checkout-available`, `core-features-free`,
`non-clinical-scope`, `no-account-or-cloud-copy`, `plain-json-readable`,
`no-tracking-code`, and `storage-and-delete`.

### Full local gates

- `CI=1 npm test`: **PASS** — 11 Vitest and 78 Playwright checks.
- `npm run lint`: **PASS**.
- `npm run build`: **PASS**; `dist/index.html` is at the artifact root.
- Initial JavaScript: 45.87 kB raw / 14.20 kB gzip.
- CSS: 20.47 kB raw / 5.28 kB gzip.
- Mobile hero WebP: 21.78 kB; largest fallback image: 147.37 kB.
- Local Lighthouse demo: **100 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO**; LCP 1152.61 ms, CLS 0, TBT 80.5 ms. Evidence:
  [lighthouse-demo.json](evidence/polish-5-local/lighthouse-demo.json).
- Local `verify-url.sh` passed Home, `?demo=1`, Privacy, and Terms. Reports are
  under [polish-5-local](evidence/polish-5-local).

### Cold production checks

Fresh mobile and desktop browser contexts opened the production URL after
deployment. [live-recheck.json](evidence/polish-5-live/live-recheck.json)
records passes for:

- first-screen wording and above-fold sample action;
- one-click `?demo=1`, banner, Reset demo, Start for real, sample editing, and
  real/demo storage isolation;
- route titles, descriptions, canonical/social metadata, focus,
  announcements, and browser Back;
- the exact license-verification request boundary and revoked-license lock;
- the no-advertising/no-analytics production-bundle and request scan;
- the real-card IndexedDB/localStorage inventory and browser storage deletion;
- offline reload with the complete sample intact;
- the designed HTTP 404 with metadata, header/footer, and legal links;
- the live Sociobot 303 redirect to a Dodo checkout session;
- every shipped/internal link plus the external source link, and production
  CSP, referrer, and nosniff headers;
- no serious/critical axe violations on Home, Demo, Privacy, Terms, or 404;
- zero unexpected console/page errors;
- byte identity between deployed and local JavaScript.

Live `verify-url.sh` also passed Home, `?demo=1`, Privacy, and Terms. Live
Lighthouse scored **100/100/100/100**, with LCP 1058.21 ms, CLS 0, and TBT
31 ms. Evidence is under [polish-5-live](evidence/polish-5-live).

Key screenshots:

- [Cold mobile Home](evidence/polish-5-live/home-mobile-cold.png)
- [Cold mobile demo](evidence/polish-5-live/demo-mobile-cold.png)
- [Offline mobile demo](evidence/polish-5-live/demo-offline-mobile.png)
- [Privacy](evidence/polish-5-live/privacy-desktop.png)
- [Terms](evidence/polish-5-live/terms-desktop.png)
- [Storage cleared](evidence/polish-5-live/storage-cleared-mobile.png)
- [Revoked license](evidence/polish-5-live/revoked-license-mobile.png)
- [Designed 404](evidence/polish-5-live/not-found-mobile.png)

The full cumulative finding-to-evidence map is in
[polish-5.md](polish-5.md).

## Run and verify

```sh
npm ci
CI=1 npm test
npm run lint
npm run build
npm run preview
```

Run the production audit with:

```sh
node tests/live-recheck.mjs
```

## Known gaps and next steps

None. No review, product, claim, accessibility, privacy, offline, routing,
mobile, build, deployment, or live-site issue remains open.
