# v0.12.47 Presentation Audit — Official Menu Superstar Art

## Goal
Stop using collectible-card fronts as decorative wrestler photography in menu compositions. A card is now visually treated as a card only when the interface is actually representing a collectible, product, deck object or reward.

## Architecture
### Dedicated menu-photo layer
`js/data/artwork.js` now keeps menu photography independent from collectible artwork:
- `menuSuperstarArtwork`
- `menuSuperstarPhotoFor(superstarId)`

`js/ui/app.js` uses `menuSuperstarPhotoMarkup()` for menu/hero portraits. If a dedicated v0.12.47 profile render is unavailable, it falls back to the existing local Superstar artwork rather than to a collectible card front.

### Local asset strategy
The dedicated profile renders are stored in:
`assets/art/wwe-menu-superstars/`

They are locally optimized transparent WebP copies. The app does not hotlink WWE.com at runtime. Source URLs are documented in `SOURCES.md`.

## Coverage
Dedicated v0.12.47 WWE profile renders: **12**.

The entire SummerSlam — Series 1 roster has a dedicated menu render:
CM Punk, Roman Reigns, Cody Rhodes, Seth Rollins, Kevin Owens, Brock Lesnar, Gunther and Oba Femi.

Additional fixed menu-feature renders:
IYO SKY, Becky Lynch, The Rock and Stone Cold Steve Austin.

## Screen review
### Home
- Dominant starter presentation is wrestler photography only.
- Removed the miniature starter-card overlay from the main stage.
- Season Final Boss composition uses Rock photography without a second Rock collectible floating over it.
- My Collection, Booster Vault, Deck Lab and Challenges use wrestler photo layers instead of card crops.
- Utility destinations use compact wrestler cutouts instead of miniature framed cards.

### Play
- Exhibition: Cody Rhodes photography.
- Climb the Ladder: Gunther photography.
- Championship Road: Roman Reigns photography.
- Removed the redundant miniature collectible card from each cinematic banner.

### Hero and run surfaces
The common portrait renderer means Season, Challenges, Booster Vault, Store hero, Collection hero, My Legacy, Exhibition and run-mode portrait nodes use clean wrestler photography where available.

### Card/product boundaries preserved
The Store Superstar shelf remains a collectible-card product shelf. Deck Lab inventory remains card-driven. Collection, Catalogue, booster reveals and match cards are unchanged.

## iPhone framing
The new `.official-menu-superstar-photo` treatment uses `object-fit: contain` and `object-position: center bottom`. Dedicated wrappers scale/position the wrestler rather than clipping a portrait/card rectangle. Mobile overrides widen the wrestler layer while maintaining the text-safe left side of each composition.

## Regression locks
New v0.12.47 tests verify:
- dedicated menu artwork remains separate from collectible artwork;
- local WWE menu WebPs exist;
- menu renderer prefers the dedicated photo layer;
- Home and Play no longer emit decorative collectible-card overlays;
- collectible-card rendering remains active in actual card/product contexts.

## Certification
224/224 tests pass. Validation, collector-ID and flow audits report zero issues. No gameplay data changed.
