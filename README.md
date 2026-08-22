# WWE Legacy v0.14.03 — Razor Bulldog Replacement

This build supersedes **v0.14.02 — Razor Lead Off Rework** and includes every previously completed/tablet change through v0.14.02.

## Razor Ramon

- **NG1-017** is reassigned from the retired **Razor’s Chokeslam** to **Razor’s Bulldog**, preserving the collector slot.
- **Razor’s Bulldog** is a **3★ Rare Trademark Grapple** at **Cost 5 / Damage 8 / Technical 1**. It grounds the opponent.
- On Connect, Razor’s Bulldog **searches/draws The Razor’s Edge** and gives The Razor’s Edge a **1-Cost discount** for the current Control sequence.
- **Razor’s Fallaway Slam** now discounts the next **Razor’s Bulldog** by 1 Cost, preserving Razor’s authored signature chain.
- Razor’s 60-page deck replaces all three Razor’s Chokeslam copies with three Razor’s Bulldog copies.
- Existing Normal / Emerald / Sapphire / Ruby ownership of Razor’s Chokeslam migrates one-for-one to Razor’s Bulldog, and saved Deck Lab references migrate to the new card id.
- Razor keeps the v0.14.02 Momentum plan: **6 Strength / 5 Strike / 1 Technical**, with the sole Technical Momentum guaranteed in Lead Off 5.
- The shared generic **Bulldog** remains absent from Razor’s deck; this change adds the separate Razor-exclusive Trademark.

## Balance observation

A fixed-seed comparison against the other 39 Superstars in the five currently live player-facing sets produced **51.5% Razor wins across 1,560 matches**, **24.17 average turns**, and **0 stalls**.

## Packaging

This distributed ZIP intentionally **does not include the `assets/` directory**. Apply/overlay it onto the existing current WWE Legacy installation that already contains the flat asset library. No existing asset is deleted or renamed by this package. Card Art Studio now targets `card-layered-move-razor-ramon-bulldog.webp` for new Razor’s Bulldog artwork.

## Verification

- 820 tests discovered / 723 passed / 0 failed / 97 intentionally skipped historical contracts (verified against inherited v0.14.00 assets).
- v0.14.03 targeted tests: 4/4 passed.
- Validation: 76 Superstars / 76 decks / 706 gameplay cards / 0 orphans / 0 issues.
- Collector ID audit: 782 cards / 782 manifest entries / 0 issues.
- Flow, card-effect, and counter/submission-state audits: 0 issues.

See `BUILD-CERTIFICATION.md` for the complete certification and `RELEASE-NOTES-v0.13.94.md` for the cumulative changelog.
