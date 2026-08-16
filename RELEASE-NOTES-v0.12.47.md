# WWE Legacy CCG — v0.12.47
## Official Menu Superstar Art

v0.12.47 replaces decorative collectible-card crops on menu presentation surfaces with dedicated wrestler photography. The change is presentation-only and builds directly on v0.12.46.

### Menu photography architecture
- Added a separate `menuSuperstarArtwork` layer in `js/data/artwork.js`.
- Added `menuSuperstarPhotoFor()` so menu composition can prefer dedicated presentation photography without changing collectible-card art.
- Added `menuSuperstarPhotoMarkup()` in the main UI renderer with a local fallback to the existing Superstar portrait library.
- Official WWE Superstar profile renders are cached locally as transparent WebP assets under `assets/art/wwe-menu-superstars/` for reliable GitHub Pages/iPhone presentation.
- Source/provenance notes are kept in `assets/art/wwe-menu-superstars/SOURCES.md`.

### Dedicated WWE.com menu renders
The dedicated v0.12.47 menu layer contains 12 local profile renders:
- CM Punk
- Roman Reigns
- Cody Rhodes
- Seth Rollins
- Kevin Owens
- Brock Lesnar
- Gunther
- Oba Femi
- IYO SKY
- Becky Lynch
- The Rock
- Stone Cold Steve Austin

This covers the complete SummerSlam — Series 1 roster plus the fixed featured wrestlers used across Home, Season, Challenges and utility presentation.

### Where cards were removed as decoration
- Home main Superstar stage
- Home Season destination
- Home command plates
- Home utility rail
- Play → Exhibition / Climb the Ladder / Championship Road banners
- My Legacy hero
- Other hero/portrait surfaces that use the common menu-photo renderer

### Where cards deliberately remain cards
No collectible-card presentation was removed from actual card/product contexts. Card fronts remain in:
- Collection
- Card Catalogue
- Booster/card reveals
- Match hand and Play Pile
- Deck Lab card inventory / Superstar deck products
- Store Superstar unlock shelf
- Match results and other explicit collectible rewards

### Presentation treatment
- Menu wrestler photography uses transparent, contained composition rather than cropped card rectangles.
- Hero photography is positioned from the lower edge, allowing full-body/torso framing to scale cleanly across iPhone widths.
- Home command plates and utility destinations use the same photo language for consistency.
- Play banners now rely on one dominant Superstar render and the mode typography/logo rather than a second miniature card competing for attention.

### Compatibility
All v0.12.46 interface-density work remains, and all v0.12.43 gameplay/balance plus settled pin, Counter, retained-Control draw, submission, body-damage, Momentum, Entrance and Adrenaline rules are unchanged.

### Certification
- 224 / 224 automated tests passing
- 50 Superstars
- 50 legal decks
- 432 gameplay cards
- 0 orphans
- 0 validation issues
- 482 / 482 collector IDs
- 0 card-ID issues
- 0 flow issues
- Browser module graph/cache stamps aligned to 0.12.47
- Card Art Studio visible build/cache aligned to 0.12.47
