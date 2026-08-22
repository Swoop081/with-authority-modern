# WWE Legacy v0.13.98 — Build Certification

**Build:** Razor Abdominal Stretch Replacement  
**Release date:** 22 August 2026  
**Supersedes:** v0.13.97 — Card Art Studio Export Hotfix

## Locked change

- **NG1-016** is now **Razor’s Abdominal Stretch**, replacing the retired Razor’s Running Powerslam without changing the New Generation collector numbering.
- Card values: **3★ Rare Trademark / Cost 5 / Technical 2 / Submission / standing opponent only / +5 persistent Chest damage per successful turn**.
- Razor’s authored deck contains three copies of the replacement in the same signature slot.
- Razor’s Fallaway Slam discounts Razor’s Chokeslam directly so its post-grounding combo remains playable.
- Ownership migration preserves all four printing tiers and rewrites saved Deck Lab references from the retired id to the replacement id.
- Card Art Studio exports the new layered plate as `card-layered-move-razor-ramon-abdominal-stretch.webp`.
- No pack odds, rewards, Season 1 progression, live-set availability, asset-layout or unrelated card changes.

## Automated verification

- Node test suite: **802 discovered / 710 passed / 0 failed / 92 intentionally skipped historical contracts**.
- v0.13.98 targeted Razor replacement tests: **4/4 passed**.
- Rebuild validation: **76 Superstars / 76 decks / 706 gameplay cards / 0 orphans / 0 issues**.
- Collector ID audit: **782 cards / 782 manifest entries / 0 issues**.
- Flow audit: **76 Superstars / 0 issues**.
- Card-effect audit: **574 scoped gameplay cards / 388 effect-bearing cards checked / 0 issues**.
- Counter/submission-state audit: **706 gameplay cards / 517 Moves / 48 submissions / 0 issues**.
- Flat asset audit: **616 images / 310 installed gameplay-card fronts (158 layered + 152 flat) / 48 headshots / 38 menu portraits**.
- Targeted 280-match Razor vs New Generation CPU smoke simulation: **0 stalls**.

## Regression coverage

The v0.13.98 tests lock:

1. the replacement card’s rarity, cost, Technical requirement, standing Submission rules and persistent Chest pressure;
2. preservation of **NG1-016** and Razor’s three-copy authored signature slot;
3. the legal Fallaway Slam → Chokeslam discount chain;
4. one-for-one ownership and saved-deck migration across Normal / Emerald / Sapphire / Ruby printings.

**Certification:** PASS
