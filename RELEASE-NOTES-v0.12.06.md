# WWE Legacy: Collectible Card Game — v0.12.06
## Deck Lab + Mobile UX Pass

v0.12.06 turns Deck Lab into the game’s full collection-driven deck builder and packages the accumulated mobile presentation fixes from the latest iPhone review pass.

### Deck Lab — full deck builder
- **Deck Lab** remains the feature name and is now a complete deck-construction flow rather than a placeholder tile.
- The entry screen lists **owned/unlocked Superstars only**; locked Superstars are hidden.
- Selecting a Superstar opens an editor with the selected **Superstar + Entrance** and the **Lead Off 5** presented prominently across the top.
- Every Lead Off slot has a **Change** control. Replacement pickers show owned eligible Moves and Momentum while preserving deck ownership/copy rules.
- Deck contents are grouped into:
  - Finishers & Trademarks
  - High-Level Moves
  - Mid-Level Moves
  - Low-Level Moves
  - Actions / Specials
  - Momentum
- Each category shows both the current count and the **recommended count derived from that Superstar’s canonical recommended deck**. Recommendations are guidance rather than hard composition quotas.
- Category pickers show **all owned cards in that category**. Cards the selected Superstar cannot legally use remain visible but are shaded/disabled and explain why.
- **Only Show Valid** can filter any picker to cards legal for the selected Superstar.
- A persistent **x / 55** counter and validity panel identify exact deck problems.
- **Save Deck is disabled until the deck is legal.** Validation covers deck size, ownership, copy limits, Method limits, exclusivity/family eligibility, Lead Off structure and Entrance compatibility.
- Custom legal decks may exceed the recommended category counts, including Momentum. The canonical recommended decks remain unchanged.

### Configurable Entrances
- The Superstar’s canonical Entrance remains the default when that Superstar unlocks.
- Deck Lab now treats Entrance as a configurable strategic slot.
- The selected Entrance persists per Superstar and is used in the actual match intro/effect resolution.
- Architecture now supports future **shared Entrance cards** in boosters; Superstar-specific Entrances remain exclusive and are not booster pulls.

### Navigation + attention states
- Bottom navigation is now a **fully horizontally scrollable all-tab bar**:
  Home → Play → Season → Challenges → Packs → Collection → Catalogue → Deck Lab → Store → My Legacy → Options.
- **Challenges returns as a dedicated tab.**
- Home still presents the major destinations as tiles, including Deck Lab, Store and Options.
- Actionable destinations can glow/badge:
  - Packs when unopened packs are available
  - Challenges when rewards are claimable
  - Season when a reward/free pack is ready

### Mobile presentation pass
- Superstar selection is vertically compacted so the selected card, Superstar name and Confirm button can fit much more naturally in a single iPhone viewport.
- Play-mode hero artwork is scaled/repositioned so featured Superstar cards support rather than obscure the mode names.
- **Tonight’s Main Event** show logos are substantially larger and surrounding dead space is reduced.
- Entrance-screen show logos are substantially larger.
- Entrance effects / crowd-chant callouts now live **outside the flipped Entrance card**, so they remain theatrical without covering card rules text.
- Match command and Play buttons inherit the **active show/arena palette** rather than default blue; Money in the Bank uses its green/gold presentation family.
- Live Momentum cards receive stronger full-card Method colour treatment, brighter symbols and more prominent Method-coloured framing/glow.

### Content integrity
This is a systems/UI release. No canonical Superstar designs, recommended 55-page decks, gameplay-card values, collector numbering or booster contents were changed.

### Validation
- Automated tests: **75 / 75 pass**
- Superstars: **46**
- Recommended decks: **46**
- Gameplay cards: **406**
- Collector manifest: **452**
- Orphans: **0**
- Rebuild issues: **0**
- Card-ID audit: **clean**
- Flow audit: **clean**

Deterministic balance simulation:
- Matches: **2,070**
- Stalls: **0**
- Average turns: **36.7**
- Pin finishes: **1,663**
- Submission finishes: **289**
- Turn-limit draws: **118**
