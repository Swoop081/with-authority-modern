# WWE Legacy v0.13.36 — Build Certification

**Super Pack Flow + Deck Ownership Hotfix**

- **543/543 regression tests pass.**
- Validation: **50 Superstars / 50 decks / 481 gameplay cards / 0 orphans / 0 issues**.
- Flow audit: **50 Superstars / 0 issues**.
- Card-ID audit: **531/531 / 0 issues**.
- Counter-state audit: **481 gameplay cards / 350 Moves / 0 issues**.
- Card-effect audit: **29 test Superstars / 332 gameplay cards / 196 effect-bearing cards / 0 issues**.
- Economy smoke: **60 packs / 300 cards / 0 duplicate Entrance pulls / 0 foil-first failures**.
- Long-term economy model uses the corrected five-match tower yield of **4 normal victory boosters + 1 Super Pack** and continues to report **0 direct Live Event win-UP**.
- Released-roster soak: **25 released Superstars / 6,000 matches / 0 stalls / 27.09 average turns / 5,476 pins / 524 submissions**.
- Released + RAW pre-release soak: **29 test Superstars / 8,120 matches / 0 stalls / 26.58 average turns / 7,413 pins / 707 submissions**.
- Full authored-roster soak: **50 Superstars / 4,900 matches / 0 stalls / 26.05 average turns / 4,639 pins / 261 submissions**.
- Dead-turn audit: **2,450 matches / 4.38 passes per match / maximum consecutive pass streak 4**.
- Custom-front artwork audit: **531 collector cards / 493 missing custom fronts**; missing authored fronts continue to use the canonical fallback presentation.
- Profile schema remains **31**.

## v0.13.36 certification focus
- Structured-mode completion suppresses the normal victory booster on the final win and leaves only the mode/tournament Super Pack reward.
- No direct UP is awarded by the completing victory.
- Super Pack Card 5 uses the explicit next/summary interaction and cannot remain trapped on the final reveal screen.
- Player-facing automatic Deck Lab builds are passed through a final owned-inventory guard; no auto-built draft may use more copies of a card than the Collection owns.
- Deck validity continues to surface unowned/over-owned copies and blocks Save Deck until corrected.
- No unrelated gameplay balance or content changes are included.
