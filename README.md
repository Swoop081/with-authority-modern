# WWE Legacy: Collectible Card Game

Current working build: **v0.12.13 — Boot Cache-Coherence Hotfix**.

The player-facing game is currently gated to the intended launch pool: **SummerSlam — Series 1, Hall of Fame — Series 1, and Evolution — Series 1**, with 24 launch Superstars and 271 launch collector cards. Authored future sets remain preserved internally but hidden until release.

Roman Reigns — SummerSlam Series 1 no longer uses Sitout Crucifix Powerbomb. **SS1-034 is Ooh Ahh!!**, a Roman-exclusive Cost 2 Action that tutors Roman’s Spear (or grants +1 Adrenaline if it is already in hand) and reduces the next Roman’s Spear this Control sequence by 1 Cost. Roman’s 55-page recommended deck replaces the two retired Crucifix Powerbomb copies with 1× Ooh Ahh!! and 1× additional Headbutt.

Canonical global Finisher rule remains intact: Finishers have no Method Momentum requirements.

v0.12.13 fixes the v0.12.12 boot regression by ensuring `index.html` and all explicitly versioned browser modules use the same cache key. Startup smoke tests now cover both fresh and migrated profiles.

Validation: **95/95 tests pass; fresh/migrated boot smoke pass; 50 authored Superstars; 50 decks; 422 gameplay cards; 472 collector cards; 0 orphans/issues; card-ID and flow audits clean.**
