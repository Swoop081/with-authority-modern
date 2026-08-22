# WWE Legacy v0.14.00 — Tabled UI Consolidation

This build supersedes v0.13.99 and rolls the full outstanding WWE Legacy running-change list into one release rather than shipping only the most recently discussed item. All v0.13.99 Attitude Rock gameplay changes and every earlier locked fix remain intact.

## Included tabled changes
- **Season 1 splash card centering:** the John Cena completion Superstar card remains the physical reward-card presentation on the launch/continue Season 1 promo, but is now explicitly centered inside its left-side bay.
- **Official Season 1 Cena render:** Season 1 character-hero surfaces now use the official transparent John Cena profile render sourced from WWE.com. The Home Season 1 tile and Season Road hero use the new local flat asset `assets/images/art-wwe-menu-superstars-john-cena.webp`.
- **Superstar duplicate-nameplate cleanup:** when a layered Superstar front is unavailable and the renderer falls back to a finished flat/custom Superstar front that already contains its authored printed name, the runtime-generated nameplate is suppressed. Layered Superstar fronts with a deliberately blank nameplate keep the runtime nameplate, so cards such as Razor Ramon remain correctly labelled while finished fronts such as Cody Rhodes and Charlotte Flair no longer show a second box over the artwork.

## Current live content
Five player-facing sets remain live: **SummerSlam — Series 1, Evolution — Series 1, New Generation — Series 1, Golden Era — Series 1, and Attitude Era — Series 1**. RAW and other banked sets remain unavailable until explicitly released.

## Season 1
Season 1 remains the **30-day / 50-tier John Cena — The Last Time Is Now** chase. This release changes presentation only; no Season XP, tier rewards, deck data, pack odds or progression values change.

## Verification
- 809 tests discovered / 717 passed / 0 failed / 92 intentionally skipped historical contracts.
- Rebuild validation: 76 Superstars / 76 decks / 706 gameplay cards / 0 orphans / 0 issues.
- Collector ID audit: 782 cards / 782 manifest entries / 0 issues.
- Flow audit: 76 Superstars / 0 issues.
- Card-effect audit: 0 issues.
- Counter/submission-state audit: 0 issues.
- Flat asset audit: 617 images / 310 installed gameplay-card fronts / 48 headshots / 39 menu portraits.

See `RELEASE-NOTES-v0.13.94.md` for the cumulative changelog and `BUILD-CERTIFICATION.md` for release verification.
