# WWE Legacy v0.11.39 — Booster Reveal + Summary Polish

## Pack reveal
- Adds visible rarity to each revealed card: Common, Uncommon, Rare or Very Rare.
- Foil remains a separate callout.
- Shrinks/clears the reveal card area enough that the collectible no longer sits over the Next Card / View Pack Summary button on iPhone.

## Pack Complete
- Replaces the horizontally scrolling five-card strip with a fixed 2 / 1 / 2 layout.
- The highest-rarity pull is always placed in the centre feature position; Foil breaks rarity ties.
- Adds rarity badges to the summary cards.
- Adds a direct `Finish Pack & Return to Booster Vault` action alongside roster/deck-upgrade review.

## No-packs state
- The standard pack graphic is only shown when at least one standard booster is available.
- When standard boosters are empty but Ladder/Championship packs remain, the Vault tells the player to choose one of those pack types.
- When the selected set has no packs of any type, the Vault shows `NO PACKS AVAILABLE` and a `Back to Main Menu` action instead of a dead `Tap to Open` pack.

## Compatibility
- No gameplay, cards, decks, collection contents, balance, collector numbers or Card Art Studio data changed.
- Build-wide cache-busting stamp updated to v0.11.39.

## Validation
- 201/201 automated tests passed.
- Artwork audit: 387/387 active collectibles resolve to a local image.
- Full-25 certification: 0 issues.
- Flow audit completed successfully.
