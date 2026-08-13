# WWE Legacy: Collectible Card Game — v0.11.73

## Consolidated Gameplay + Presentation Completion Pass

This release completes the outstanding presentation and flow items carried forward from the v0.11.69–v0.11.72 playtest review.

### Match presentation
- Match HUD is now true sticky app chrome at the top of the viewport with the large dead-space offset removed.
- HP is approximately doubled in visual weight and overlaps the inner edge of the transparent headshot area.
- Play Pile cards are reduced again by roughly 30%, remain newest-first, and are laid across a new top-down wrestling-ring canvas.
- The active show logo is centred on the ring mat.
- RAW, SmackDown, SummerSlam, Evolution, Money in the Bank and Worlds Collide presentation themes now tint the match environment/ring treatment while gameplay colours retain their mechanical meaning.
- Empty Play Piles show the clean branded ring rather than the READY placeholder.
- Tonight's Main Event presentation uses a substantially larger show logo, larger event lockup, larger Superstar cards, larger VS and a stronger Start Match anchor.

### HUD / Superstar imagery
- Missing Superstar-facing artwork now falls back to a neutral WWE Legacy `ARTWORK PENDING` Superstar silhouette instead of recycling another wrestler/action photograph.
- HUD headshots continue to open the full Superstar card overlay, with tap-to-flip and outside-tap-to-close.

### Card backs
- Superstar backs now resolve the canonical Superstar ability directly from Superstar data and also show Method Limits and Starter Momentum.
- Entrance backs resolve the full canonical Entrance rules text and use cleaner `Linked Superstar` wording.
- Special, Action, Support and Manager backs use canonical rules text consistently.
- Card-back labels distinguish Superstar Ability, Entrance Effect and Move Effect instead of a generic empty Rules block.

### Superstar unlock / deck building
- Store Superstar purchases no longer grant the Lead Off 5 or silently install a 55-card recommended deck.
- A Superstar purchase grants the Superstar identity and linked Entrance only.
- Immediately after a new Store Superstar unlock, the player is asked whether to build the recommended deck from cards already owned.
- The recommended blueprint populates only copies present in the Collection.
- Missing slots are surfaced in Deck Lab; the authored opening-five blueprint shows which cards are owned or missing.
- Auto Fill uses legal owned cards only and never creates phantom collection copies.
- Manual Fill opens Deck Lab for the unlocked Superstar.
- Profile migration trims old auto-installed saved decks down to actual owned-copy counts.

### Store / navigation
- Store now presents the featured booster as a physical WWE Legacy booster product, with pack art/branding as the hero purchase object.
- Featured Superstars are presented as a shop shelf rather than Lead Off bundles.
- Bottom navigation remains anchored to the bottom but is compacted and restores the full destinations: Home, Play, Season, Packs, Collection, Catalogue, Store and My Legacy.
- Options remains consolidated inside My Legacy.

### Results screen
- The winning Superstar collectible card is now fully visible and brought forward as a hero object.
- Victory rewards show a physical branded booster object alongside the reward copy rather than text alone.

### Card Art Studio
- Local-file export safety was rebuilt for set branding assets.
- RAW, Worlds Collide, Money in the Bank and official SmackDown set logos are embedded into an export-safe data source when the Studio is opened from `file://`.
- The old blanket local-project-asset export rejection has been removed; the Studio now retries on a clean canvas and only asks for artwork re-selection if the artwork source itself remains unsafe.
- SmackDown remains fully available in Card Art Studio and uses the official supplied SmackDown logo.

### Validation
- 44 / 44 automated tests pass.
- 38 Superstar decks validate.
- 327 gameplay cards validate with 0 orphan gameplay cards.
- 365 / 365 collector IDs validate with no gaps.
- Flow audit reports 0 issues.
