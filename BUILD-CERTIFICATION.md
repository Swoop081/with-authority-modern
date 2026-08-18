# WWE Legacy v0.13.24 — Build Certification

**iPhone Interface + Championship Road Campaign Pass**

- **480/480 regression tests pass.**
- Validation: **50 Superstars / 50 decks / 462 gameplay cards / 0 orphans / 0 issues**.
- Flow audit: **50 Superstars / 0 issues**.
- Card-ID audit: **512/512 / 0 issues**.
- Counter-state audit: **462 gameplay cards / 331 Moves / 0 issues**.
- Card-effect audit: **29 test Superstars / 324 gameplay cards / 190 effect-bearing cards / 0 issues**.
- Economy smoke: **60 packs / 300 cards / 0 duplicate Entrance pulls / 0 foil-first failures**.
- Released + RAW pre-release soak: **29 test Superstars / 8,120 matches / 0 stalls / 26.64 average turns / 7,420 pins / 700 submissions**.
- Full authored-roster soak: **50 Superstars / 4,900 matches / 0 stalls / 26.05 average turns / 4,639 pins / 261 submissions**.
- Dead-turn audit: **2,450 matches / 4.39 passes per match / maximum consecutive pass streak 4**.
- Custom-front artwork audit: **512 collector cards / 475 missing custom fronts**. This is the existing artwork backlog and is not a v0.13.24 regression.
- Active hidden pre-release scope remains **currently released content + RAW Series 1 only**.
- Profile schema remains **30**.

## v0.13.24 certification focus
- Championship Road is a fixed **24-match** Season 1 map with the approved six four-match thematic regions.
- Difficulty progression is locked to **Easy → Normal → Hard → Hardcore**, with higher difficulties gated by a full clear of the previous one.
- Championship Road CPU HP modifiers are exactly **-5 / 0 / +5 / +10**, with no player HP modifier.
- Completing all four Road difficulties requires **96 campaign wins**.
- Standard Championship Road booster awards occur only at the end of each four-match region, preventing the expanded campaign from multiplying the old per-win pack economy.
- Existing full-Road Championship Pack and first-Superstar-clear behavior are preserved.
- The former Daily Ladder is player-facing **Money in the Bank** and lives only inside **Live Events**; its 8-opponent / 3-life / same-day-field mechanics are unchanged.
- KOTR uses a true 8-Superstar card bracket, horizontally scrollable at Quarterfinals and contracting to four Superstars for Semifinals and two for the Final.
- KOTR single-elimination, coronation, Reigning King state and choose-1-of-3 one-booster reward are unchanged.
- Season 1 uses a graphic **100-tier reward road**, live Season-end countdown and current-tier auto-focus.
- Home Season tile, global PACKS/UP header, Live Events titles, Exhibition selector, My Challenges, Packs, Store, My Collection, Card Catalogue and My Legacy all carry the approved iPhone spacing/typography cleanup.
- Store Featured Superstars are presented as a **2-column vertical grid** and UP prices use a bright gold currency treatment; prices are unchanged.
- My Challenges no longer contains Money in the Bank and no longer uses the Becky Lynch hero treatment.
- Packs, Collection, Catalogue and My Legacy no longer use redundant Roman hero/repeated-title blocks.
- Legacy four-match active Championship Road runs are retired safely; historical clear/reward data is preserved.
- Existing global Superstar chase remains **2% natural / one global 100-miss pity**.
- Existing Action taxonomy remains **69 Actions / 0 Special-kind collectible cards**.
- Secondary Superstar unlocks remain capped at **1 Finisher / 1 Trademark / 1 Action**, with no manufactured 60-page deck or Superstar-specific Entrance grant.
- The proposed expanded Achievements/AP/Career Score system remains **on hold and unimplemented**.
- No printed card balance, Superstar base HP, Method limits, authored deck blueprints, Store prices, duplicate values, normal booster rarity weights, Superstar chase odds, pity threshold, release dates or artwork inventory changed.
