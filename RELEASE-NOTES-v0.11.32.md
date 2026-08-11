# WWE Legacy v0.11.32 — Home Hub Rebuild

This release rebuilds the main Home hub around clearer destinations and removes the global sticky WWE Legacy/version banner from the app shell.

## Home hub
- Removed the global top banner from every screen.
- Added a bright LED-style Season 1 countdown strip at the top of Home. It opens the Season 1 hub when tapped.
- Replaced the old Welcome Back/Create Your Legacy hero with **My Collection**, showing owned-card and Superstar progress and opening the owned-card view.
- Kept the dedicated **Unlock the Final Boss** Season 1 reward promo.
- Removed the duplicate Season 1 Final Boss tile from the menu grid.
- Removed **Game & Testing** from the main Home menu. Options remains available from the persistent navigation.
- Tightened Home tiles and rewrote them as bold, direct destinations: Enter the Ring, Card Catalogue, Booster Packs, Deck Lab, Challenges and My Legacy.

## Collection vs Catalogue
- **My Collection** shows only cards actually owned by the current local profile.
- **Card Catalogue** shows all 387 active cards.
- Both views open across **All Sets** by default and support set, card type, rarity and text filtering.
- The two views can be switched directly from the Collection/Catalogue screen.

## Persistent hub navigation
- Bottom hub buttons are roughly twice the previous height and width.
- The hub scrolls horizontally on phones instead of squeezing labels/icons into tiny cells.
- Replaced generic text glyphs with distinct SVG icons for Home, Play, Collection, Catalogue, Packs, Season, My Legacy and Options.

## Scope / validation
- No gameplay, deck, card-pool, collector-number, balance or Card Art Studio data changed.
- 192/192 automated tests passed.
- Artwork audit: 387/387.
- Full-25 certification: 0 issues.
- Flow audit completed successfully.
