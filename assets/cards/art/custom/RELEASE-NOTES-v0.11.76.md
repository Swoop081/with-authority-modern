# WWE Legacy: Collectible Card Game — v0.11.76

## v1.0 Completion + Outstanding Regression Closure

This build closes the remaining presentation and stability items from the v1.0 playtest pass.

- Rebuilt Booster Vault as one visual shelf of every unopened pack the player can actually open. Removed set filter buttons and separate Standard/Ladder/Championship selector controls; each owned pack product is now directly tappable with its set, source and quantity shown on the pack.
- Locked pack-opening front/back reveal geometry to one immutable card stage. Rarity, NEW state and instructions reserve fixed space and no longer move the physical card between reveal states.
- Removed the redundant Next Card control from the reveal flow. Tap the face-down card to reveal; tap the revealed card to advance; the fifth card advances to Pack Complete.
- Rebuilt Pack Complete and Roster Construction around one viewport-safe 2 / 1 / 2 real-card component. The highest-rarity pull is centered and enlarged, with Foil breaking rarity ties.
- Removed leaked research/citation prose from Seth Rollins move rules including Phoenix Splash, and added player-facing sanitation against citation/URL/research-source leakage.
- Restored installed Superstar/wrestler artwork as the fallback behind finished Card Art Studio fronts; generic placeholder art is now used only when no real installed artwork exists.
- Hardened Collection rendering for iPhone by limiting the initial live card DOM to 48 cards with Show More paging. Catalogue keeps its existing page limit. Both routes retain the premium gallery presentation while reducing repeated route memory pressure.
- Reapplied the mobile match-layout regression fix: hard viewport constraints, true two-column HUD, oversized inward HP, fixed safe-area HUD positioning, correctly proportioned ring surface and compact Play Pile cards.
- Kept the eight-destination bottom navigation as a large, fixed, horizontally scrollable dock rather than shrinking every destination to fit one phone width.
- Preserved the v1.0 Season hierarchy, Card Shop UP positioning, recommended owned-card deck construction, complete Superstar/Entrance card backs, show-themed match presentation and victory/reward presentation from the prior consolidated pass.

Validation: 44/44 automated tests pass; 38 decks / 327 gameplay cards / 0 orphan cards / 0 rebuild issues; flow audit clean; 365/365 collector IDs valid.
