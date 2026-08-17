# WWE Legacy v0.12.78 — Build Certification

- Regression tests: **348/348 pass**
- Validation: **50 Superstars / 50 decks / 438 gameplay cards / 0 orphans / 0 issues**
- Flow audit: **50 Superstars / 0 issues**
- Card-ID audit: **488/488 / 0 issues**
- Counter-state audit: **438 gameplay cards / 318 Moves / 0 issues**
- Economy smoke audit: **60 packs / 300 cards / 0 duplicate Entrance pulls / 0 foil-first failures**
- Art audit: **451 unfinished custom fronts** (known artwork backlog; fallback presentation remains active)
- v0.12.78 regression coverage: **5 dedicated tests** covering career W/L persistence, per-Superstar/mode/finish records, achievement unlocks and migration, Final Boss card replacement, collector identity, ownership migration and My Legacy integration.

## v0.12.78 — Career Record + Achievements + Lay The Smack Down

- **My Legacy is now the permanent career record.** Every completed match records a player Win or Loss exactly once.
- Career history includes **overall W/L**, **W/L for every unlocked Superstar**, and **W/L by game mode**: Exhibition, Weekly Live Event, Climb the Ladder and Championship Road.
- My Legacy displays win percentage for the overall, mode and Superstar records.
- Finish-type results are retained internally so achievements can distinguish pinfall and submission wins.
- Existing profiles do **not** receive fabricated historical W/L totals. Exact match tracking begins at v0.12.78 because older builds did not store every match result.
- Existing concrete mode-clear counters are preserved and can unlock their matching achievements during migration.
- Adds **14 persistent achievements**: First Bell, Winner's Circle, Ten Victories, Main Eventer, Living Legend, Century Club, All-Terrain Superstar, Locker Room Leader, Roster General, Pinfall Specialist, Submission Specialist, Ladder Conqueror, Championship Gold and Live Event Headliner.
- Season 1 Final Boss **S1FB-001 Final Boss Slap** is retired and replaced by **Lay The Smack Down**.
- Lay The Smack Down remains a Rock-exclusive **Rare (3★) Strike Move**, **Cost 4 / Damage 7 / requires 2 Strike**, with **Arm Extended** Counter State and the existing **opponent loses 1 Adrenaline** effect.
- Collector slot **S1FB-001** is preserved. Existing normal/Foil ownership and saved-deck references migrate to `the-rock-lay-the-smack-down`.
- Tier 5 of the Season 1 Final Boss Reward Road now awards Lay The Smack Down, and The Rock's authored deck contains the replacement rather than the retired card.
- No other card costs, damage, effects, rarities, ownership caps, Superstar HP, game-mode rewards, booster odds, pin rules, submission rules or counter rules changed.

The package is built through the clean allowlist staging process introduced in v0.12.69.
