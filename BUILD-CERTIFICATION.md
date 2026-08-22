# WWE Legacy v0.14.00 — Build Certification

**Build:** Tabled UI Consolidation  
**Release date:** 22 August 2026  
**Supersedes:** v0.13.99 — Attitude Rock Finisher Pass

## Locked changes

1. **Season 1 launch promo alignment**
   - John Cena's physical Season 1 completion Superstar card remains on the left side of the launch/continue promo.
   - The card is explicitly centered in that allocated bay on iPhone/mobile layouts instead of sitting visually off-center.

2. **Official WWE.com John Cena Season 1 render**
   - Added `assets/images/art-wwe-menu-superstars-john-cena.webp` from WWE.com's official John Cena profile render.
   - Home Season 1 and Season Road character-hero surfaces use the transparent Cena render instead of the physical card as character art.
   - The launch/continue promo intentionally keeps the physical completion card because that panel describes the Tier 100 collectible reward.

3. **Finished Superstar front nameplate cleanup**
   - Layered Superstar fronts continue to receive the authored runtime nameplate because their exported layered plates may deliberately leave the lower name area blank.
   - If a layered Superstar plate is missing and the card falls back to a finished flat/custom front that already contains its printed name, the card receives `has-flat-superstar-front` and the runtime `.ccg-superstar-nameplate` is suppressed.
   - If that flat front also fails and the renderer falls back again, the suppression class is removed so the runtime label is available when needed.
   - This removes the duplicate box from Live Event route cards such as Cody Rhodes / Charlotte Flair while preserving the correct label on layered cards such as Razor Ramon.

## Automated verification

- Node test suite: **809 discovered / 717 passed / 0 failed / 92 intentionally skipped historical contracts**.
- v0.14.00 targeted UI consolidation tests: **3/3 passed**.
- Rebuild validation: **76 Superstars / 76 decks / 706 gameplay cards / 0 orphans / 0 issues**.
- Collector ID audit: **782 cards / 782 manifest entries / 0 issues**.
- Flow audit: **76 Superstars / 0 issues**.
- Card-effect audit: **574 scoped gameplay cards / 389 effect-bearing cards checked / 0 issues**.
- Counter/submission-state audit: **706 gameplay cards / 517 Moves / 48 submissions / 0 issues**.
- Flat asset audit: **617 images / 310 installed gameplay-card fronts (158 layered + 152 flat) / 48 headshots / 39 menu portraits**.

## Regression coverage

The v0.14.00 targeted tests lock:

1. presence of the local WWE.com John Cena render and its use on Home Season 1 + Season Road character-hero surfaces;
2. retention and explicit centering of the physical Cena completion card on the launch/continue Season 1 promo;
3. conditional removal of the runtime Superstar nameplate only when a layered front falls back to a finished flat Superstar front.

**Certification:** PASS
