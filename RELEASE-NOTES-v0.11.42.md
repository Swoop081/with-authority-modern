# WWE Legacy v0.11.42 — Final Menu & Match-Select Pass

This release consolidates the final menu redesign list and mobile artwork-tool improvements without changing the active card pool, decks or match engine.

## Splash / global navigation
- Splash now shows a small centered build number directly beneath **COLLECTIBLE CARD GAME**.
- Returning-player copy is now **Continue Your Legacy**, so the save is not framed around the original starter once multiple decks are unlocked.
- Options reads the same central `BUILD_VERSION` as the cache-busting system instead of a stale hard-coded version.
- Persistent hub order is now **Home → Play → Season → Packs → Collection → Catalogue → My Legacy → Options**.

## Play menu
- Exhibition, Climb the Ladder and Championship Road tiles now use one clean hero Superstar composition each instead of two overlapping card images.
- The redundant standalone Back to Main Menu button is removed; the persistent Home button remains available.

## Owned-only horizontal Superstar selection
- Exhibition, Climb the Ladder and Championship Road now share one larger horizontal card-carousel pattern.
- Locked/unowned Superstars are hidden entirely from character-select choices.
- Favourites sort to the front, then remaining owned Superstars sort alphabetically.
- Tapping a Superstar card selects it and flips it to a details side with HP, archetype, Entrance and Superstar ability.
- Player/Opponent/Run choices require explicit confirmation before the match/run can start.
- Exhibition CPU choices also use only owned/unlocked Superstars and exclude the chosen Player 1 Superstar.

## Favourite Superstars
- Owned Superstar cards in My Collection now have an **Add Favourite / Favourite** control.
- Favourite IDs persist in the local profile and migrate safely for existing saves.

## Climb the Ladder / Championship Road cleanup
- Shortcut navigation blocks are removed from both mode screens.
- Path/era choices are compact horizontal scrolling selectors.
- Climb the Ladder shortens long selector labels to **Hall of Fame** and **Evolution** while preserving the underlying branch data.
- Both modes use the shared owned-only horizontal Superstar carousel.

## Card Art Studio on iPhone
- Finished-card export now prefers WebP but accepts the browser's PNG fallback instead of failing on iPhone Chrome/WebKit.
- On iPhone, the Studio attempts to open the native iOS share sheet with the generated file so it can be sent to Files, Google Drive or another installed destination.
- Desktop/browser download remains the fallback when native file sharing is unavailable.

## PNG → WebP Bulk Converter
- New `tools/png-to-webp.html` utility.
- Supports desktop folder selection or multi-file selection.
- Converts PNG/JPG/WebP artwork to WebP at adjustable quality (88% default).
- Preserves filenames and relative folder paths.
- Shows per-file and total size savings.
- Packages the converted batch into one downloadable ZIP.
- Linked from My Legacy alongside Card Art Studio.

## Certification
- Automated suite: **216 / 216 passed**.
- Artwork audit: **387 / 387** active collectibles resolve to local artwork.
- Full-25 certification: **0 issues**.
- Flow audit completed successfully.

No gameplay, active-card, deck, collector-number or balance changes are included in this release.
