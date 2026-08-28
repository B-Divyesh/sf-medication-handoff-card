# Medication Handoff Card — build handoff

## Shipped

Finished v1 of the local-first medication handoff PWA:

- Card owner/keeper identity and a prominent non-clinical safety disclaimer.
- Add, edit, and stop/remove medication flows for name, dose, timing,
  prescriber, and notes; required fields use native validation.
- Immutable visible history for additions, edits, stops, and dated whole-list
  confirmations, including the person who confirmed it.
- A large-type print/PDF view containing the current list, confirmation line,
  print date, recent changes, and safety note.
- IndexedDB persistence with JSON export/import and user-confirmed replacement.
- Optional $12 one-time Sociobot unlock, return-token capture, once-daily
  verification cache, paste-to-restore flow, and offline optimistic unlock.
- Paid encrypted `.mhc` backups using AES-GCM/PBKDF2. Core data export,
  accessibility, printing, and safety behavior remain free.
- Installable PWA manifest, 192/512 maskable icon, versioned app-shell cache,
  network-first navigation, cache-first assets, first-install offline support,
  update notice, and dedicated offline fallback.
- Responsive light/dark cinematic visual system, generated and reviewed hero,
  reduced-motion fallback, 44 px targets, focus treatment, empty/error/offline
  states, privacy/terms pages, sitemap, and robots policy.

## Verification

Run from a clean checkout:

```sh
npm ci
npm test
npm run build
```

Verified on 2026-08-28:

- `npm test`: 2 unit tests and 10 Playwright tests passed across desktop Chrome
  and Pixel 5/mobile projects. Coverage includes create/edit/confirm/stop,
  persistence, legal pages, paid license restoration, encrypted download, axe,
  and `context.setOffline(true)` reload.
- `npm run build`: passed; output is `dist/` with `dist/index.html` at root.
- Production payload: 32.22 KB JavaScript (10.52 KB gzip), 16.60 KB CSS
  (4.60 KB gzip), 22 KB mobile hero WebP / 76 KB large WebP. No fonts or
  third-party runtime scripts.
- Lighthouse mobile: **97 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO**; FCP 1.0 s, LCP 1.9 s, TBT 170 ms, CLS 0, total transfer 105 KiB.
- Axe 4.10: no serious or critical findings on main or privacy screens in both
  desktop and mobile projects.
- Manual visual review: 390 px-style mobile layout, generated hero content, and
  print stylesheet inspected; no browser console errors in the core test.
- `npm audit --audit-level=high`: 0 vulnerabilities.

Exact factory build command: `npm run build`

Static deploy directory: `dist/`

## Known gaps / release steps

- The factory still needs to register `medication-handoff-card` and its $12
  one-time price in the Sociobot billing engine. The UI intentionally uses the
  slug-based production endpoint and contains no provider/product ID.
- Browser print engines make final pagination decisions. The stylesheet is
  designed for one page for ordinary household lists; very long notes or many
  medicines may require a second page rather than shrinking into illegibility.
- Data is intentionally device-local with no collaboration or sync. Users must
  export a backup to move the record or protect against cleared browser data.
- No interaction checking, medical recommendations, reminders, dispensing,
  refills, or clinician integration are included by design.

## Asset provenance

The hero was generated through the factory image deployment on 2026-08-28 and
reviewed for text, logos, labels, people, and unintended medical claims. Source,
exact prompt, and review notes are in `assets/src/`; shipped WebP derivatives
are each below the 300 KB hero budget. The app icon is hand-authored from basic
geometry and uses the product palette. Full rationale is in
`.factory/design.md`.
