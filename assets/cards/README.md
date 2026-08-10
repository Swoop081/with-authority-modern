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

Open `tools/card-art-studio.html` (or use **Profile → Card Art Studio**). The unified editor contains every active Season 1 card and can be filtered by set and card type. Choose your artwork, position/scale it, and export a complete **680×1000 WebP**.

Canonical finished-front paths are automatic:

- Superstars: `assets/cards/art/custom/superstars/<superstar-id>.webp`
- Moves: `assets/cards/art/custom/moves/<card-id>.webp`
- Entrances: `assets/cards/art/custom/entrances/<card-id>.webp`
- Specials: `assets/cards/art/custom/specials/<card-id>.webp`
- Managers: `assets/cards/art/custom/managers/<card-id>.webp`
- Actions: `assets/cards/art/custom/actions/<card-id>.webp`
- Supports: `assets/cards/art/custom/supports/<card-id>.webp`
- Momentum: `assets/cards/art/custom/momentum/<card-id>.webp`

No manifest edit is required. The game checks the canonical path automatically and falls back to the older artwork/generated front when a finished WebP is absent, so the collection can be converted progressively. Detailed gameplay information remains on the shared card back.
