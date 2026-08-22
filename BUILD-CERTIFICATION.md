# WWE Legacy v0.14.04 — Build Certification

**Build:** Razor Lead Off Sync + Tabled UI  
**Release date:** 22 August 2026  
**Supersedes:** v0.14.03 — Razor Bulldog Replacement

## Locked changes

1. **Existing Razor saves now receive the intended Lead Off**
   - Authored Lead Off remains: Strength Momentum / Strike Momentum / Technical Momentum / Fallaway Slam / Punch.
   - Root cause of the reported mismatch: a valid 60-page `profile.savedDecks["razor-ramon"]` overrides the authored deck in playable-deck construction, so profiles created before the v0.14.02 Lead Off change could retain the old first five.
   - Profile schema increments from 38 to **39**.
   - For pre-39 profiles with a complete saved Razor deck, migration finds the existing copies of the five authored Lead Off pages and moves those exact saved entries to positions 1–5.
   - Printing tiers, card counts and the remaining 55-card order are preserved.
   - The sync executes after normal saved-deck cleanup so only a still-valid 60-page saved deck is reordered. If a saved deck is invalid/incomplete, normal authored-deck fallback behavior remains intact.

2. **Razor deck/balance state remains locked**
   - 60 pages / 12 Momentum.
   - Momentum split: **6 Strength / 5 Strike / 1 Technical**.
   - Razor’s Abdominal Stretch: Technical 1.
   - Razor’s Bulldog: Technical 1.
   - No Razor cost, damage, rarity, effect, copy-count or Momentum-distribution change in v0.14.04.

3. **All outstanding tabled UI changes included**
   - Season 1 launch/continue promo uses the canonical John Cena collectible-card renderer, preferring the installed layered physical card and then the flat Card Studio front. The card is centered in its reward bay and its image uses centered containment.
   - Home Season 1 John Cena render is enlarged to comparable visual scale with the Seth Rollins and Becky Lynch command-tile renders.
   - Pack Complete five-card summary receives responsive iPhone containment: uniform cards, internal vertical scroll when required, contained badge rows, dedicated helper-copy space and a clear NEXT CTA.

## Distribution rule

- The user-facing v0.14.04 ZIP **excludes the entire `assets/` directory**.
- It is an overlay/update package and expects the existing current flat asset library to remain in place.
- No asset is deleted, renamed or repackaged by this build.

## Automated verification

- Node test suite against inherited v0.14.00 flat assets: **823 discovered / 726 passed / 0 failed / 97 intentionally skipped historical contracts**.
- v0.14.04 targeted tests: **3/3 passed**.
- Rebuild validation: **76 Superstars / 76 decks / 706 gameplay cards / 0 orphans / 0 issues**.
- Collector ID audit: **782 cards / 782 manifest entries / 0 issues**.
- Flow audit: **76 Superstars / 0 issues**.
- Card-effect audit: **574 scoped gameplay cards / 389 effect-bearing cards / 0 issues**.
- Counter/submission-state audit: **706 gameplay cards / 517 Moves / 0 issues**.
- Flat asset audit against inherited v0.14.00 assets: **617 images / 310 installed gameplay-card fronts / 48 headshots / 39 menu portraits**.
