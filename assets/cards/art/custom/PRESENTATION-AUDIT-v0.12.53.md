# v0.12.53 — Final Boss Menu Art Audit

## Requested correction

Replace the small Rock image shown on the Season 1 Final Boss promotion with the exact user-provided Final Boss render, and use that same render anywhere that small Final Boss cutout was reused.

## Implementation

A dedicated `finalBossRockMenuArtwork` asset was added without adding The Rock back into the general 12-person menu-render cast. `finalBossRockMarkup()` is used only on Final Boss reward/promotion surfaces.

### Surfaces updated

- Splash / launch Final Boss promotional panel.
- Home Season One Live / Tier 50 banner.
- Season Road to the Final Boss hero.

### Not changed

- The Rock collectible Superstar card.
- Rock move / Entrance / Special card art.
- The locked 12-person general menu render cast.
- Any gameplay data or balance.

## Layout treatment

The transparent render is bottom-anchored and sized per surface so Rock reads as a full Final Boss figure rather than the previous small cutout. Splash, Home and Season each keep their existing text/CTA hierarchy while using the new dedicated art.

## Regression

- 239 / 239 tests pass.
- Validation: 0 issues.
- Card IDs: 484 / 484, 0 issues.
- Flow: 0 issues.
