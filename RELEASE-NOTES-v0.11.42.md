# WWE Legacy v0.11.42 — Final Menu + Match Select Pass

## Menu polish
- Play mode tiles now use one clean featured Superstar image each; overlapping double-card compositions are removed.
- Splash shows the live build version beneath **COLLECTIBLE CARD GAME** and returning profiles now say **Continue Your Legacy**.
- Options reads its version from the same central `BUILD_VERSION` used by release cache-busting.
- Play no longer has a redundant Back to Main Menu button.
- Persistent navigation order is now **Home → Play → Season → Packs → Collection → Catalogue → My Legacy → Options**.

## Match-select overhaul
- Exhibition, Climb the Ladder and Championship Road now use large horizontal Superstar carousels.
- Only owned/unlocked Superstars are shown as selectable choices; locked cards no longer clutter character select.
- Favourite Superstars sort first.
- Tap a Superstar card to flip into its details, then explicitly confirm the choice.
- Exhibition requires player and CPU confirmation before Start Exhibition becomes active.
- Climb the Ladder and Championship Road remove their redundant shortcut buttons and use compact horizontal path/era selectors.

## Favourite Superstars
- Owned Superstar cards in **My Collection** now have an Add Favourite / Favourite control.
- Favourite status is saved locally and carried through profile migration.

## Card Art Studio / tools
- Fixed **All Sets** card resolution so a card selected while the Set filter is All Sets correctly resolves its own set template/logo.
- iPhone export now tries WebP first and falls back to PNG when WebKit cannot encode WebP.
- Added **Save / Share Card** using the native file share sheet where supported, allowing destinations such as Files or Google Drive.
- Added `tools/png-to-webp-converter.html`: select many PNG/JPG files or a desktop folder, convert at adjustable quality, review size savings, and download the converted WebPs as one ZIP.

## Certification
- 211/211 automated tests passed.
- Artwork audit: 387/387 active collectibles resolve to local artwork.
- Full-25 certification: 0 issues.
- Flow audit completed successfully.
- 10,000-match matrix: 0 stalls / 46 draws.

No card pool, collector number, deck balance, or gameplay-rule changes were made in this release.
