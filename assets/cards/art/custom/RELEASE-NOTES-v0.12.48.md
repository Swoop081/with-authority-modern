# WWE Legacy: Collectible Card Game — v0.12.48
## Dedicated Menu Render Cast

v0.12.48 supersedes v0.12.47 as the current working baseline.

This is a presentation-asset pass only. No gameplay, roster, AI, deck, card, economy, match-flow, pin, Counter, Momentum, Entrance, Adrenaline, Submission or persistent-injury rules changed.

### Dedicated menu-render cast
The dedicated WWE.com menu-render pool is now exactly 12 Superstars:

**SummerSlam — Series 1**
- CM Punk
- Roman Reigns
- Cody Rhodes
- Seth Rollins

**Hall of Fame — Series 1**
- Stone Cold Steve Austin
- The Undertaker
- Hulk Hogan
- Ultimate Warrior

**Evolution — Series 1**
- Liv Morgan
- Rhea Ripley
- Paige
- Becky Lynch

### Asset policy
- Dedicated menu renders are cached locally as optimized WebP files under `assets/art/wwe-menu-superstars/`.
- The dedicated folder contains only the 12 requested WebPs plus `SOURCES.md`.
- Gunther, Kevin Owens, Brock Lesnar, Oba Femi, IYO SKY and The Rock are no longer members of the dedicated menu-render pool.
- Those and all other Superstars still fall back to the existing local Superstar artwork when used dynamically in menu contexts.
- Actual collectible-card/product contexts continue to use collectible card fronts.

### Source provenance
Official WWE Superstar profile pages and direct source asset URLs are recorded in `assets/art/wwe-menu-superstars/SOURCES.md`.

### Certification
- 225 / 225 automated tests pass.
- Validation: 50 Superstars / 50 decks / 432 gameplay cards / 0 orphans / 0 issues.
- Card-ID audit: 482 cards / 482 manifest entries / 0 issues.
- Flow audit: 50 Superstars / 0 issues.
- Browser cache/import stamps aligned to v0.12.48.
