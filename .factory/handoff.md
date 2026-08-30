# Medication Handoff Card — polish round 4 handoff

## Outcome

**PASS — all review findings are closed and the repaired PWA is live.**

The round 4 repair adds direct claim coverage for license-request privacy and
revoked-license locking. Privacy, Terms, settings, and README copy now state
only what the sandbox proves. All earlier fixes remain intact: plain first
screen, isolated one-click demo, real routing and route metadata, focus and
Back behavior, complete HTTP 404, legal links, mobile layout, local storage,
offline reload, print/PDF, and backup/restore.

The kitchen-table document visual identity is preserved. A final live audit
also found and fixed transient low contrast during row entrance by keeping text
fully opaque while retaining the short translate motion.

## Source and deployment

- Product repair commits: `6f0ba7d`, `b0a0194`.
- Branch: `main`; both repair commits pushed to `origin/main`.
- Deploy command: `/opt/fleet/lib/deploy-static.sh medication-handoff-card dist`.
- Azure Static Web App: `sf-medication-handoff-card`, resource group `sociobot`.
- Final deployment ID: `228ef627-2b20-4f07-9db1-1c1c003bde6c`.
- Default host: <https://delightful-water-039582310.7.azurestaticapps.net>.
- Production URL: <https://medication-handoff-card.sociobot.in>.
- Production bundles: `index-c_0VTt33.js`, `index-D3mHgyMf.css`.
- Live/local JavaScript SHA-256:
  `8832c4d37f4fbdce99c3a22bfdbcef7dc03e9a482652473ece3038c243f14587`.

## Exact verification evidence

### Clean-clone claims

All 17 literal commands in `.factory/claims.json` passed from
`/tmp/mhc-polish4-claims-76E88k/repo`. Each command ran its own clean
`npm ci --ignore-scripts --no-audit --no-fund` and the tagged test in both the
desktop and 390×844 browser projects.

The 17 IDs are `demo-isolation`, `local-record`, `offline-reload`,
`json-backup`, `full-history-backup`, `print-card`, `dialog-keyboard`,
`encrypted-backup`, `license-verification-data`, `revoked-license-lock`,
`record-workflow`, `adaptive-interface`, `checkout-available`,
`core-features-free`, `non-clinical-scope`, `no-account-or-cloud-copy`, and
`plain-json-readable`.

### Full local gates

- `CI=1 npm test`: **PASS** — 10 Vitest and 74 Playwright checks.
- `npm run lint`: **PASS**.
- `npm run build`: **PASS**; `dist/index.html` is at the artifact root.
- Initial JavaScript: 45.99 kB raw / 14.28 kB gzip.
- CSS: 20.47 kB raw / 5.28 kB gzip.
- Mobile hero WebP: 21.78 kB; largest fallback image: 147.37 kB.
- Local Lighthouse demo: **100/100/100/100**; LCP 1098.45 ms, CLS 0,
  TBT 0. Evidence: [`lighthouse-demo.json`](evidence/polish-4-local/lighthouse-demo.json).
- Local `verify-url.sh` passed both Home and `?demo=1`; reports are under
  [`evidence/polish-4-local`](evidence/polish-4-local).

### Cold production checks

A fresh mobile and desktop browser context opened the custom production URL
after deployment. [`live-recheck.json`](evidence/polish-4-live/live-recheck.json)
records passes for:

- first-screen wording and above-fold sample action;
- one-click `?demo=1`, persistent banner, Reset demo, Start for real, sample
  editing, and real/demo storage isolation;
- route titles, canonical metadata, focus, announcements, and browser Back;
- Privacy/Terms claim copy and absence of the removed merchant/refund claims;
- exact license-verification request contents and revoked-license locking;
- offline reload with the sample intact;
- a real HTTP 404 with product shell and legal links;
- the live Sociobot 303 redirect to a Dodo checkout session;
- no serious/critical axe violations on Home, Demo, Privacy, Terms, or 404;
- no unexpected console or page errors;
- byte identity between the deployed and local JavaScript bundle.

Live `verify-url.sh` passed Home and `?demo=1`. Live Lighthouse scored
**100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO**, with
LCP 1052.65 ms, CLS 0, and TBT 57.5 ms. Evidence is under
[`evidence/polish-4-live`](evidence/polish-4-live).

Key screenshots:

- [Cold mobile home](evidence/polish-4-live/home-mobile-cold.png)
- [Cold mobile demo](evidence/polish-4-live/demo-mobile-cold.png)
- [Offline mobile demo](evidence/polish-4-live/demo-offline-mobile.png)
- [Privacy](evidence/polish-4-live/privacy-desktop.png)
- [Terms](evidence/polish-4-live/terms-desktop.png)
- [Revoked license](evidence/polish-4-live/revoked-license-mobile.png)
- [Designed 404](evidence/polish-4-live/not-found-mobile.png)

## Run and verify

```sh
npm ci
CI=1 npm test
npm run build
npm run preview
```

Run the production audit with:

```sh
node tests/live-recheck.mjs
```

## Known gaps and next steps

None. No review, product, claim, accessibility, privacy, offline, routing,
mobile, build, or deployment issue remains open.
