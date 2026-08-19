# WWE Legacy v0.13.51 — Season Viewport Gap Removal Hotfix

## Fixed
- Removes the large empty purple band between the global WWE Legacy top status bar and the frozen Season One hero.
- Removes the large empty black band above the fixed bottom navigation.
- Root cause: older global `main` chrome rules used multiple `:not()` selectors with `!important`, so they had higher specificity than the v0.13.50 Season reset. The Season surface was correctly inset between the top bar and bottom nav, but then received those same top/bottom paddings a second time internally.
- The Season viewport now explicitly outranks those legacy padding rules. The frozen Season One hero begins immediately beneath the top band, and the tier-road scroller expands all the way down to the top edge of the bottom navigation.
- The full Season One hero, Rock artwork, three Current Tier / Rewards Ready / Universe Points tiles and Free Booster strip remain permanently frozen. Only the tier road scrolls.

## Retained
- v0.13.50 fixed-viewport / Safari scroll-restoration protection remains locked.
- v0.13.48 Home SEASON ONE / DECK LAB typography parity remains locked.
- v0.13.47 Safari card-art broken-image flicker protection remains locked.
- No gameplay, balance, economy, card, deck, collector, reward, profile-schema or release-calendar changes.
