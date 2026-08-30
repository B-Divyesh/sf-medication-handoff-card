# Medication Handoff Card — visual thesis

## Direction: the kitchen table before the appointment

The product uses **cinematic environmental art**: a quiet blue-hour kitchen
table where a paper list, glasses, and unbranded medicine containers are set
out before a family handoff. The visual metaphor is preparation in a familiar
place, not treatment or surveillance. The interface borrows the scene's deep
shadows, warm paper, pencil marks, and one coral annotation color. Decoration
appears only on the welcome/empty state; once the user is working, the record
itself takes the visual lead.

## Palette

| Token | Value | Role |
| --- | --- | --- |
| Midnight | `#17252B` | App header, strongest text |
| Ink | `#203137` | Body text |
| Paper | `#F6F0E4` | Main background, like a card on a table |
| Linen | `#FFFDF8` | Forms and record surfaces |
| Fog | `#58676C` | Secondary text (accessible on Paper/Linen) |
| Coral pencil | `#B44532` | Primary actions and changed-item marks |
| Coral dark | `#873225` | Hover/pressed actions |
| Sage | `#426B5A` | Confirmed/saved state |
| Ochre | `#8A5B16` | Stale-date warning |
| Error | `#A12D2D` | Validation and destructive state |
| Night paper | `#172126` | Dark-mode background |
| Night surface | `#213138` | Dark-mode surfaces |

All text pairs meet WCAG AA. Light and dark modes follow the system, with an
explicit in-app choice. Color is always accompanied by a word, icon, or shape.

## Type

- Display/record headings: Georgia, Cambria, `Times New Roman`, serif. Its
  editorial authority makes the printout feel like a deliberate document.
- Interface/body: Inter-compatible system stack (`ui-sans-serif`, system UI,
  Segoe UI, sans-serif), avoiding external font requests and keeping the PWA
  fast and private.
- Scale: 14, 16, 18, 22, 30, and fluid 40–58 px. Medication doses and dates use
  tabular figures. Body text is never below 16 px in task flows.

## Space and structure

An 8 px base rhythm with 4 px for tight label relationships. The desktop app
uses a narrow 1140 px stage: record and change-log columns, separated by open
space rather than a dashboard grid. Phone layouts become a single narrative:
identity, current medicines, then changes. Touch targets are at least 44 px.

The recurring motif is a clipped paper corner and a short coral rule. It evokes
an annotation without imitating a hospital form. Status chips use restrained
outlines and explicit labels.

## Interaction grammar

- “Add medicine” is the single dominant action.
- Editing opens a focused native dialog from the selected row; focus returns
  to its origin. Saving creates a visible change-log entry immediately.
- Removing a medicine is described as “Stop and remove” and requires a reason;
  the action removes it from the current list while preserving history.
- Confirmation is a deliberate dated action with the confirmed-by name.
- Export/import lives under “Backup & settings,” separate from daily editing.
- Print preview is the handoff climax: a clean, large-type one-page record.

## Motion policy

New or edited rows settle with 180 ms translate motion from their point of
change; dialogs scale over 160 ms. Text stays fully opaque so contrast does not
dip during motion. Nothing loops or flashes.
With `prefers-reduced-motion: reduce`, all transforms and smooth scrolling are
removed and state changes are immediate; hierarchy remains through spacing,
type, and borders.

## Original asset plan and provenance

Hero scene: one generated still life, shown in the empty/welcome state and
cropped responsively. It clarifies the product's world without implying drug
advice. App icons and interface symbols are hand-authored SVG/simple geometry.

**Prompt sheet**

- Use case: stylized-concept
- Asset type: responsive landing/empty-state hero
- Subject/world: a quiet early-morning kitchen table prepared for a family
  medication handoff; a blank cream paper card, reading glasses, a weekly pill
  organizer, two generic unbranded amber medicine bottles, and a pencil
- Materials: worn oak, textured paper, glass, matte plastic
- Light/lens: cinematic blue-hour window light with one warm practical lamp,
  50 mm editorial still-life lens, shallow but readable depth of field
- Composition: 3:2 landscape, objects weighted to the right, calm negative
  space on the left, viewed slightly above table height
- Palette words: deep teal shadow, parchment, quiet sage, coral pencil mark
- Negative list: people, hands, readable writing, labels, logos, brands,
  watermarks, loose pills, medical symbols, dramatic illness, sterile clinic
- Required phrase: “no text, no watermark, no logos”

Generated with the factory image deployment (`/opt/fleet/lib/gen-image.sh`) on
2026-08-28. The generated image is original to this product; the selected
source and exact prompt are retained in `assets/src/hero-kitchen-table.json`.

The 1200 × 630 social preview is a center crop of that original scene. The SVG
favicon and PNG app/touch icons derive from the hand-authored card-and-check
mark in `assets/src/app-icon.svg`; no third-party artwork is used.
