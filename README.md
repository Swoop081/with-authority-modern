# WWE Legacy v0.13.97 — Card Art Studio Export Hotfix

This build supersedes v0.13.96. It fixes two Card Art Studio export regressions: John Cena / Season 1 artwork can now export safely from a locally opened Studio, and every exported file now uses the exact flat install filename shown by the Studio instead of dropping the `card-layered-` / `card-custom-` prefix. Gameplay, balance, reward economy, pack odds, four-tier progression, Season 1 Cena, Attitude Era Rock, live-set availability and grants remain unchanged.

## First-time onboarding
- New saves still choose **CM Punk or Roman Reigns** and receive a complete 60-page **Normal-tier** starter deck.
- The starter choice now displays the actual collectible **Normal Superstar cards** for Punk and Roman rather than portrait panels.
- The one-time Welcome choice still offers **SummerSlam, Evolution, New Generation, Golden Era, or Attitude Era**.
- Each Welcome set is now represented by its **physical booster-pack design**. Selecting the pack awards one random eligible Superstar from that set and that Superstar's complete 60-page Normal deck.
- SummerSlam continues to exclude the already-selected Punk/Roman starter from its random pool.
- The awarded Welcome Superstar retains the full iPhone hero-card reveal introduced in v0.13.93.

## Current live content
Five player-facing sets remain live: **SummerSlam — Series 1, Evolution — Series 1, New Generation — Series 1, Golden Era — Series 1, and Attitude Era — Series 1**. RAW and other banked sets remain unavailable until a later build explicitly releases them.

## Season 1
Season 1 remains the **30-day / 50-tier John Cena — The Last Time Is Now** chase, with five Normal copies of each Cena-exclusive Move distributed across the road, Ruby The Time Is Now Entrance at Tier 48, and Ruby John Cena at Tier 50.

See the canonical `RELEASE-NOTES-v0.13.94.md` changelog and `BUILD-CERTIFICATION.md` for this build's exact changes and verification.


### Asset layout (v0.13.96)
All runtime images are stored directly in `assets/images/`. Do not create per-card-type image subfolders. Card Studio exports should use the flat filenames shown by the Studio. Missing art intentionally uses the rules/details fallback.


### v0.13.96 presentation hotfix
- Card fronts no longer display separate `NORMAL D#`, `EMERALD D#`, `SAPPHIRE D#`, or `RUBY D#` stat badges over installed artwork.
- Welcome Superstar explicitly bypasses the persistent app-chrome top padding and is top-anchored on iPhone.


### v0.13.97 Card Art Studio export hotfix
- Local `file://` Card Studio sessions now use export-safe embedded copies of every packaged set logo, including **Season 1 — The Last Time Is Now**, so John Cena Superstar-card exports no longer fail because the logo taints the canvas.
- This protection applies to all set-logo assets that previously came from local files, preventing the same export failure on other sets.
- **Export Art Plate**, **Export Card**, and **Save / Share** now name the file from the displayed install destination. Examples: `card-layered-superstar-john-cena.webp` and `card-layered-move-mr-perfect-perfect-plex.webp`.
- PNG fallback uses the same canonical basename with `.png`.
- No card data, artwork, gameplay values, pack odds, progression, economy or live-set availability changed.
