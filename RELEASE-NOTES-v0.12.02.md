# WWE Legacy v0.12.02 — Card Art Studio Set Isolation Fix

## Fixed
- Corrected the Card Art Studio regression introduced during the Survivor Series identity pass.
- Restored the dedicated renderers for SummerSlam, Hall of Fame, Evolution, Final Boss, RAW, Worlds Collide and Money in the Bank.
- Restored the SmackDown/Danhausen Halloween template helper.
- Survivor Series — Series 1 now uses its official Houston 2026 front **only** for Survivor Series cards.
- Changing Set or Card once again refreshes the selected card name, collector code, stats, template and set label instead of leaving the previous Survivor Series preview frozen.
- Bumped the Studio CSS/JS/data cache keys to v0.12.02 so browsers do not reuse the broken v0.12.01 Studio script.
- Updated the cache-stamping utility to handle v0.12.x and future 0.x versions instead of only matching v0.11.x.

## Regression protection
- Added an automated Card Art Studio renderer/selection wiring test covering all nine active set identities.

## Gameplay/content
- No gameplay, card, deck, numbering, booster or balance changes from v0.12.01.
