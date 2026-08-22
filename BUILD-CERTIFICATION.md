# WWE Legacy v0.14.03 — Build Certification

**Build:** Razor Bulldog Replacement  
**Release date:** 22 August 2026  
**Supersedes:** v0.14.02 — Razor Lead Off Rework

## Locked changes

1. **Razor’s Bulldog replaces Razor’s Chokeslam**
   - NG1-017 remains the collector identity.
   - New id: `razor-ramon-bulldog`.
   - Name: **Razor’s Bulldog**.
   - 3★ Rare Trademark Grapple.
   - Cost 5 / Damage 8 / Technical 1.
   - Grounds opponent; Front Control counter state.
   - On Connect: search/draw **The Razor’s Edge** and discount it by 1 Cost for the current Control sequence.

2. **Signature-chain continuity**
   - Razor’s Fallaway Slam now discounts the next **Razor’s Bulldog** by 1 Cost.
   - Razor’s authored deck replaces all three Razor’s Chokeslam copies with three Razor’s Bulldog copies.
   - The v0.14.02 6 Strength / 5 Strike / 1 Technical Momentum plan and guaranteed Technical Lead Off page are retained.
   - The shared generic Bulldog remains excluded from Razor’s deck.

3. **Ownership migration**
   - Normal, Emerald, Sapphire and Ruby ownership of `razor-ramon-chokeslam` migrates one-for-one to `razor-ramon-bulldog`.
   - Saved Deck Lab references migrate to the replacement id.
   - Profile schema increments to version 38.

4. **Balance observation**
   - Fixed-seed comparison against 39 other Superstars from the five currently live player-facing sets: 1,560 matches.
   - v0.14.03 Razor: **51.5% wins / 24.17 average turns / 0 stalls**.

## Distribution rule

- The user-facing v0.14.03 ZIP intentionally excludes the entire `assets/` directory.
- It is an overlay/update package and expects the existing current flat asset library to remain in place.
- No existing image is automatically repurposed from Chokeslam to Bulldog; until new Bulldog art is installed, the normal card fallback remains available.
- Card Art Studio export target for the replacement is `assets/images/card-layered-move-razor-ramon-bulldog.webp`.

## Automated verification

- Node test suite against inherited v0.14.00 flat assets: **820 discovered / 723 passed / 0 failed / 97 intentionally skipped historical contracts**.
- v0.14.03 targeted tests: **4/4 passed**.
- Rebuild validation: **76 Superstars / 76 decks / 706 gameplay cards / 0 orphans / 0 issues**.
- Collector ID audit: **782 cards / 782 manifest entries / 0 issues**.
- Flow audit: **76 Superstars / 0 issues**.
- Card-effect audit: **574 scoped gameplay cards / 389 effect-bearing cards / 0 issues**.
- Counter/submission-state audit: **706 gameplay cards / 517 Moves / 48 submissions / 0 issues**.
- Flat asset audit against inherited v0.14.00 assets: **617 images / 310 installed gameplay-card fronts / 48 headshots / 39 menu portraits**.
