# WWE Legacy: Collectible Card Game — v0.11.18
## Full-Art Move Cards + Move Card Studio

- Rebuilt `tools/card-art-studio.html` as **Move Card Studio**.
- Studio is self-contained and direct-`file://` compatible, with the complete **261 active Move-card pool** frozen into the editor:
  - SummerSlam — Series 1: 101 Moves
  - Hall of Fame — Series 1: 67 Moves
  - Evolution — Series 1: 78 Moves
  - Rewards / Season 1 Final Boss: 15 Moves
- Added four set-specific full-bleed Move-front designs matching the Superstar-card visual families.
- Added the SummerSlam, WWE Hall of Fame, WWE Evolution and WWE Legacy Rewards logos automatically in the top-right of Move fronts.
- Front information is intentionally reduced to **Move name + COST + DAM**. Method, Move Type, requirements, counters, effects, Superstar restrictions, rarity and Signature/Trademark/Finisher identity remain on the shared rules back.
- Custom image workflow supports upload, zoom, horizontal/vertical positioning, live preview and WebP export at 680×1000, 816×1200 or 1020×1500.
- New canonical finished Move-art path: `assets/cards/art/custom/moves/<card-id>.webp`.
- No manifest edit is required for new Move fronts.
- Runtime automatically prefers a finished Move WebP when present and falls back to the existing legacy photo + generated front overlays when it is absent.
- Added editable SVG references in `assets/templates/move/`.
- Profile tool link renamed from **Card Art Studio** to **Move Card Studio**.
