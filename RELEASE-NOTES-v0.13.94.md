# WWE Legacy v0.13.95 — Onboarding Card + Pack Presentation

Supersedes v0.13.93. Presentation-only onboarding update; gameplay, rewards, card data, Season 1 Cena, Attitude Era Rock, four-tier progression, starter grants and live-set availability are unchanged.

## Starter Superstar presentation
- CM Punk and Roman Reigns are now shown as their actual collectible **Superstar card faces** during first-time starter selection.
- Both are displayed as **Normal-tier** cards, matching the fresh-save grant.
- The screen continues to award the selected Superstar's complete 60-page Normal starter deck.

## Welcome set presentation
- Evolution, New Generation, Golden Era, Attitude Era and SummerSlam are now represented by their **physical booster-pack designs** rather than generic set-logo tiles.
- The pack is the selection object only: choosing it still awards **one random eligible Superstar from that set plus a complete 60-page Normal deck**.
- The five packs use a compact 3-over-2 iPhone grid.
- New Generation receives a dedicated blue/yellow physical wrapper treatment.

## Welcome reveal
- v0.13.93's full-height Welcome Superstar card reveal remains unchanged.

## v0.13.95 — Asset Recovery + Flat Image Directory

- Recovered the user-supplied image library from the original GitHub export after the prior package omitted most card art.
- All retained image files now live in one flat `assets/images/` directory; no image remains in a move/action/headshot/set subfolder.
- Card Art Studio, live card resolver, Superstar fronts, HUD headshots, menu portraits, logos, templates, UI art and manifest/icon references now point to the flattened filenames.
- Recovered headshots are retained and renamed as `headshot-<superstar-id>.webp`.
- Current card fronts use clean names such as `card-layered-move-<id>.webp`, `card-custom-action-<id>.webp` and `card-custom-superstar-<id>.webp`.
- Missing card artwork still falls back to the canonical rules/details face; no obsolete image is substituted merely because an old path once existed.
- Removed known retired/dead legacy image files while preserving the supplied current artwork library.
- Welcome onboarding no longer inherits the persistent app-chrome top offset, removing the large black gap at the top of the iPhone Welcome screen.

