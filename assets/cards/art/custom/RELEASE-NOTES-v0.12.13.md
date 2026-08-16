# WWE Legacy: Collectible Card Game — v0.12.13
## Boot Cache-Coherence Hotfix

v0.12.13 is a startup/package hotfix for v0.12.12. No canonical card values, Superstar designs, deck composition, collector numbering, launch-pool rules, or gameplay balance were changed.

### Fixed
- Corrected the public `index.html` cache keys. v0.12.12 accidentally still requested the v0.12.11 app, stylesheet, manifest, and icon URLs while its modules were stamped v0.12.12.
- All public entrypoint assets and explicitly versioned browser modules now use one coherent v0.12.13 cache key, preventing Safari/GitHub Pages from assembling a mixed old/new module graph after deployment.
- Added a regression test that fails the build if the public entrypoint version differs from `package.json` / `BUILD_VERSION`.
- Added startup smoke coverage that imports and renders the splash screen for both a fresh profile and a migrated existing profile.

### Preserved from v0.12.12
- Only SummerSlam — Series 1, Hall of Fame — Series 1, and Evolution — Series 1 are visible/live at launch.
- Future RAW, Worlds Collide, Money in the Bank, SmackDown, Survivor Series, and Season 2/Goldberg content remains authored but hidden from the player-facing game.
- Roman Reigns' Sitout Crucifix Powerbomb remains retired.
- SS1-034 remains **Ooh Ahh!!**.
- Roman's 55-page recommended deck remains updated with 1× Ooh Ahh!! and 1× additional Headbutt.
- Finishers remain globally free of Method Momentum requirements.

### Validation
- 95/95 automated tests pass.
- Fresh-profile boot smoke: PASS.
- Migrated-profile boot smoke: PASS.
- 50 authored Superstars / 50 complete recommended decks.
- 422 gameplay cards / 472 collector-manifest cards.
- 0 rebuild issues / 0 orphans.
- Card-ID audit clean.
- Flow audit clean.
