# WWE Legacy v0.11.12 — Superstar Art Studio Reliability Fix

## Superstar Art Studio
- Fixed the empty Superstar dropdown reported in v0.11.11.
- The studio no longer depends on ES-module imports for its 25-Superstar art roster, so it works when opened directly from an extracted build as well as when hosted.
- Added an explicit 8 / 8 / 8 / 1 set-to-Superstar mapping for SummerSlam, Hall of Fame, Evolution and Season 1 Final Boss Rewards.
- Added static SummerSlam options in the HTML as a no-JavaScript visual fallback instead of leaving the selector blank.
- Added a visible initialization error state if the studio roster ever fails to load.
- Reworked studio asset URL resolution so hosted and extracted/local builds use the same relative paths.

## Regression protection
- Added a dedicated studio regression test that verifies all canonical Superstars are represented and that the studio remains self-contained/classic-script compatible.
- No gameplay, card-pool, deck, balance or economy behavior changed in this build.
