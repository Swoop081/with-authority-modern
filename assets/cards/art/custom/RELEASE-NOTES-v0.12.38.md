# WWE Legacy: Collectible Card Game — v0.12.38
## Premium Run Menus

v0.12.38 is a presentation-only pass for **Climb the Ladder** and **Championship Road**. It supersedes v0.12.37 while preserving all gameplay, balance, card, deck, pin, Counter, Momentum, Entrance, Adrenaline and retained-Control rules from v0.12.37/v0.12.36.

### Premium single-screen mode presentation
- Rebuilt both run-mode hubs around a compact cinematic hero rather than a tall stacked setup form.
- The hero now combines the mode identity, Superstar render, branch selector and four key run statistics in one bounded panel.
- Branch/path selectors are compact grid segments so all paths are visible at once on iPhone instead of horizontally clipping the later choices.
- Replaced large repeated status text with one compact live status ribbon.

### Climb the Ladder
- Setup now uses compact full Superstar cards (multiple visible at once) with the existing tap-to-flip detail interaction preserved.
- Active runs use one fight-command panel for next opponent, selected Superstar, branch and remaining lives.
- The eight-opponent run is presented as a compact **4 x 2 rung grid** rather than eight tall vertical rows.
- Cleared/current/upcoming states retain distinct presentation, with current rung accented and cleared rungs visually subdued.

### Championship Road
- Setup uses the same compact premium Superstar selector.
- Active Road state removes the duplicated Road / Your Superstar / Next Match information card.
- One fight-command panel now carries stage, opponent, selected Superstar and primary Fight action.
- The four matches are shown as one compact **4-stage progress rail**, keeping Opening Bout through Championship Match visible together.

### iPhone fit target
- Mobile hero: 214px (206px on <=390px widths).
- Setup Superstar cards: 112x164px (105x154px on <=390px widths).
- Active progress nodes: 63px minimum height.
- Fixed bottom navigation remains unchanged.
- Layout is intentionally bounded so the complete setup or active-run command state fits above the bottom navigation on typical modern iPhone viewports without requiring the long scroll shown in v0.12.37.

### Validation
- 178/178 automated tests pass.
- 50 Superstars / 50 decks / 432 gameplay cards.
- 0 orphan cards.
- 0 validation issues.
- Card-ID audit: 0 issues.
- Flow audit: 0 issues.

No gameplay data changed in this release.
