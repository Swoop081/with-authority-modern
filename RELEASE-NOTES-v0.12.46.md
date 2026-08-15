# WWE Legacy CCG — v0.12.46 Interface Density + Hierarchy Pass

v0.12.46 supersedes v0.12.45 as the current working baseline.

This is a presentation/navigation pass only. The settled v0.12.43 gameplay balance and all v0.12.42 submission/persistent-injury, v0.12.36 actual-HP pin, retained-Control draw, Counter terminality, Momentum, Entrance and Adrenaline rules remain unchanged.

## Screenshot-driven corrections

### Play
- The three mode banners now expand to use the available iPhone viewport instead of leaving a large black void above the fixed navigation.
- The collectible-card layer on Exhibition / Climb the Ladder / Championship Road is fully contained inside the banner instead of being cut off by the bottom edge.

### Deck Lab
- If only one Superstar is unlocked, Deck Lab now skips the redundant `Choose Your Superstar` screen and opens that Superstar's deck editor immediately.
- Multi-Superstar profiles retain the chooser, now as a denser card rack with deck-ready state, name and deck count.

### Season
- The Final Boss hero is shorter and more focused.
- Tier/XP data already shown in global chrome is no longer repeated as three large hero chips.
- Hero status is reduced to reward-ready state and next-tier destination.
- Daily free booster strip and Season Command Center are significantly denser so progression information appears earlier in the first viewport.

### Challenges
- Daily/Weekly challenge cards are compact horizontal command rows rather than tall stacked panels.
- Progress, rewards and Claim state remain visible while multiple goals can fit in one viewport.
- Set Progress plates are tightened again.

### Booster Vault
- A single available pack is centred on the shelf instead of being stranded at the far left of a wide empty stage.
- Pack typography now scales with the smaller physical-pack render, fixing clipped set names and footer copy.
- Deck Assistance is reduced to a compact settings strip.

### Store
- Featured booster typography is explicitly scaled for its compact pack render so the set name is no longer clipped.
- Superstar products now use actual collectible-card fronts rather than plain portrait thumbnails.
- The eight featured Superstar products are a horizontally swipeable shelf.
- Store hero/refresh/offer density is increased so the Superstar shelf appears sooner.

### My Collection
- Set navigation is moved out of the artwork hero into its own horizontal rail, eliminating clipped set tabs over the Superstar art.
- The hero receives a stronger text-side shade and a shorter height.
- Search remains permanently visible.
- Type / rarity / sort controls are collapsed into a `FILTER & SORT` drawer so owned cards surface much sooner.

### Card Catalogue
- The huge always-open Super Sort form is retired from the default mobile view.
- Search is permanently visible in a compact command bar.
- Primary filters live in a collapsed `FILTERS` drawer.
- Detailed move-family / cost / damage / Method requirement controls are nested under `ADVANCED MOVE FILTERS`.
- Catalogue cards and pagination now surface immediately below the compact controls.

### My Legacy
- The old separate starter panel plus five oversized stat cards are replaced by one compact career command band.
- The player's original starter collectible is layered into the hero.
- Superstar count, packs opened, Ladder clears, Championship clears and Universe Points fit into one five-stat rail.
- Redundant Main Menu action is removed because persistent navigation already provides Home.

## Certification
- 220 / 220 automated tests pass.
- Validation: 50 Superstars / 50 decks / 432 gameplay cards / 0 orphans / 0 issues.
- Card-ID audit: 482 cards / 482 manifest entries / 0 issues.
- Flow audit: 50 Superstars / 0 issues.
- All active relative browser JS imports and cache keys are stamped to 0.12.46.
- Card Art Studio visible build label and script/CSS cache keys are aligned to 0.12.46.
