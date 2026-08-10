# WWE Legacy v0.11.16 — Canonical Superstar Card Art

## Superstar art now appears throughout the game
- Finished WebPs exported by Superstar Art Studio are now the preferred visual for every Superstar-facing game surface.
- The game automatically checks `assets/cards/art/custom/superstars/<superstar-id>.webp` first.
- No manifest edit is required. If a finished card is missing, the previous portrait art is used as a safe fallback.
- Superstar collectible fronts in Collection, booster reveals and unlock celebrations use the same finished card file.
- Splash/Season Final Boss promotion, starter selection, main-menu hero/tiles, Play modes, Season release adverts, Collection/Booster/Deck/Challenge/Profile heroes, roster selection, Ladder opponents and match HUDs now use the finished Superstar-card visual instead of independently cropped portrait assets.
- UI framing was adjusted so the card frame, set mark and bottom Superstar name remain visible instead of being cropped away.

## Studio workflow
- Superstar Art Studio now labels the destination as `GAME FILE · USED EVERYWHERE`.
- After export, replace the matching file under `assets/cards/art/custom/superstars/` and reload WWE Legacy.
- Added an in-folder README documenting filenames and fallback behaviour.
