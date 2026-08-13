# WWE Legacy v0.99.0 RC1 — v1 Release Candidate

Content is frozen for v1.0. This pass intentionally excludes the deferred artwork audit, common-card expansion, AI personality work, and post-match statistics screen.

## Added / completed
- First-match contextual onboarding for Momentum, Moves, Control and finish conditions.
- Premium screen transition pass and retained launch presentation.
- Match spectacle extended to Finisher, Counter, Rope Break and Count Out alongside pin/submission sequences.
- Booster opening retains the fixed-position reveal flow and 2/1/2 real-card summary from the premium booster pass.
- Collection/Catalogue hot-path lookup now uses the cached collection map rather than repeated linear scans.
- Season hub puts a prominent NEXT REWARD treatment above the 50-tier road and keeps roadmap/release information secondary.
- Universe Points balance gets change-pulse feedback; existing pack conversion and store flows remain intact.
- Deck assistance now explains why a safe upgrade is recommended.
- Profile schema v20 adds resilient settings/onboarding defaults while preserving old collection, unlocks, decks, Season XP, UP, packs and mode progress.
- Options now includes independent Music/SFX preferences, Reset Custom Decks, Reset Settings, protected Reset All Progress, and JSON save export.
- PWA service worker added for cache-first fallback after successful network load; existing manifest, icons and standalone metadata retained.
- Lightweight synthesized UI SFX hooks added for match spectacle without introducing asset-loading failure points.

## Release certification
- 48/48 automated tests pass.
- Rebuild validation: 41 Superstars, 41 decks, 350 gameplay cards, 0 orphans, 0 issues.
- Flow audit: 0 issues.
- Card manifest: 391/391, gap-free across all 8 sets.
- Final Season 1 simulation: 3,280 matches, 0 stalls, 33.7 average turns.
- Pin-health certification: 0 green attempts; 5 amber attempts / 0 successes; 8,744 red attempts / 2,884 successes.
- Finish mix: 2,884 pins / 396 submissions.

## Balance watchlist for v1 bug-fix window
The RC simulation still shows intentionally strong prestige/top-tier outliers (The Rock 81.3%, Roman 66.9%) and several lower-performing roster members. Content is frozen at RC1; further numerical changes should be treated as explicit balance fixes rather than feature additions.
