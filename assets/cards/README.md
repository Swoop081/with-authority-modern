# WWE Legacy card artwork swap guide

Card artwork is intentionally separated from gameplay data.

## Current temporary coverage

v0.5.2 guarantees that **every collectible card resolves to a local image file**. The eight SummerSlam Superstar portraits already in the project remain in place, Hall of Fame has temporary sourced wrestler photos, wrestler-specific cards inherit their wrestler image until a move-specific action photo is added, and otherwise-generic cards use a temporary wrestling action photo.

Run `npm run art` to audit the entire collection and catch any missing image path/file before packaging a build.

## Replacing a card photo

1. Put the new image in `assets/cards/art/` (WebP recommended).
2. Open `js/data/card-art-overrides.js`.
3. Add the existing card ID and file path, for example:

```js
"spear": "assets/cards/art/moves/roman-spear.webp",
```

That exact image immediately overrides the temporary fallback in the shared collectible-card template used by the match hand, Play Pile, Collection and booster reveal. No gameplay data or template code needs to change.

## Replacing a Superstar portrait

Use `superstarArtOverrides` in the same file. This updates the Superstar card and any still-temporary wrestler-specific cards that inherit the Superstar portrait.

## Recommended crops

Use portrait card crops around 3:4 or 2:3. The template uses `object-fit: cover`, so the image fills the front while the name and bottom Cost/Damage bar remain overlaid by the game.

Temporary source/provenance notes are in `ART_SOURCES.md`.


## Card Art Studio

Open `tools/card-art-studio.html` (or use Profile → Card Art Studio in the game). Select a card and the tool will generate the final filename/path and manifest entry automatically. The recommended export is **680×1000 WebP at 82% quality**. Exact card replacements go under `assets/cards/art/custom/`.

On supported desktop browsers, connect the unzipped WWE Legacy project folder and the tool will write the image and update `js/data/card-art-overrides.js` directly. Otherwise, download the WebP and updated manifest and place them into the paths shown by the tool.

## Finished Move card fronts (v0.11.18+)

Move Card Studio now exports complete Move fronts rather than photo-only artwork.

Canonical path:

`assets/cards/art/custom/moves/<card-id>.webp`

Each finished Move WebP contains the set background/frame, set logo, Move image, Move name and compact COST / DAM line. No manifest entry is required. The UI checks this canonical path automatically and, if the file is absent, falls back to the older artwork + generated title/stat overlays so cards can be converted progressively.

All detailed rules remain on the shared card back.
