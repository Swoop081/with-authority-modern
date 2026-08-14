# WWE Legacy: Collectible Card Game — v0.12.00
## Survivor Series Identity Pass

This release fixes Survivor Series — Series 1 incorrectly inheriting the SummerSlam card presentation in Card Art Studio and gives the set a complete standalone visual identity.

### Survivor Series — Series 1 Card Art Studio
- Added **Survivor Series — Series 1** to the Card Art Studio set selector.
- Added a dedicated Survivor Series card template instead of falling through to `drawSummerSlam()`.
- New palette: **cobalt blue vs crimson red**, with silver/white trim on a near-black base.
- The template uses opposing red/blue light fields, alternating battle-line accents and a silver centre division so it is immediately distinct from SummerSlam, RAW and SmackDown.
- Added Survivor-specific card-name gradient, glow, frame accent and secondary accent values.
- Added a **SURVIVOR SERIES** entry to the Studio template key.

### Dedicated logo asset
- Added `assets/branding/survivor-series-series-1/survivor-series-logo.svg`.
- Added a local source note at `assets/branding/survivor-series-series-1/SOURCE.md`.
- The Studio embeds an export-safe copy of the SVG when opened directly with `file://`, so exported cards remain origin-clean.
- Survivor Series now resolves its own set logo in the live UI rather than showing no logo.

### Live set presentation
- Added Survivor Series booster/card-back styling using the same cobalt/crimson/silver identity.
- Added `presentation-survivor-series-series-1` variables and match/ring styling for any Survivor-branded presentation context.
- Added a Survivor Series Collection/feature theme and Survivor hero roster selection.

### No gameplay changes
- Superstar designs, decks, card values, collector numbering, booster contents and balance are unchanged from v0.11.99.

### Validation
- `npm test`: **63/63 pass**.
- Rebuild validation: **46 Superstars, 46 decks, 401 gameplay cards, 0 orphans, 0 issues**.
- Card-ID audit: **447/447 cards**, Survivor Series remains gap-free at **SVS1-001 through SVS1-033**.
- Flow audit: **0 issues**.
