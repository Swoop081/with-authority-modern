# WWE Legacy: Collectible Card Game — v0.12.07
## Deck Lab Visual Card Grid Pass

v0.12.07 rebuilds the Deck Lab category picker around the actual collectible card fronts so deck construction feels like browsing a premium physical card collection rather than editing a text list.

### Three-wide visual card browser
- Deck Lab category pickers now render the **complete collectible card front** for every owned card.
- On iPhone, cards are laid out **three wide** down the screen for Finishers & Trademarks, High-Level Moves, Mid-Level Moves, Low-Level Moves, Actions / Specials and Momentum.
- The same card-first presentation is used when changing Lead Off cards and Entrances.
- Card artwork/templates remain the source of truth; the picker no longer duplicates the card name/rules as large text blocks beside the card.

### Premium compact controls
- Each category card has a compact count control directly beneath it: **− / in-deck count / +**.
- Lead Off and Entrance pickers use a simple **CHANGE** control beneath the full card.
- Small chips show **in deck / owned** counts without taking attention away from the card artwork.
- Search and **Only Show Valid** remain available in a compact sticky toolbar.

### Invalid cards stay visible
- Owned cards that the selected Superstar cannot legally use remain visible, as required.
- Invalid cards are shaded/desaturated rather than removed.
- A compact **LOCKED** badge and short legality reason explain Method limits, exclusivity/family restrictions or other eligibility failures.
- Enabling **Only Show Valid** still removes invalid options entirely.

### Content integrity
This is a Deck Lab presentation/UI release. No gameplay values, canonical decks, Superstar designs, booster contents, collector numbering, ownership rules or category recommendations changed.

### Validation
- Automated tests: **76 / 76 pass**
- Superstars: **46**
- Recommended decks: **46**
- Gameplay cards: **406**
- Collector manifest: **452**
- Orphans: **0**
- Rebuild issues: **0**
- Card-ID audit: **clean**
- Flow audit: **clean**

Deterministic balance simulation remains unchanged:
- Matches: **2,070**
- Stalls: **0**
- Average turns: **36.7**
- Pin finishes: **1,663**
- Submission finishes: **289**
- Turn-limit draws: **118**
