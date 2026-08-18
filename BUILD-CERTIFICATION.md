# WWE Legacy v0.13.33 — Build Certification

**Legend Trademark + Shared Move Pass**

- **520/520 regression tests pass.**
- Validation: **50 Superstars / 50 decks / 480 gameplay cards / 0 orphans / 0 issues**.
- Flow audit: **50 Superstars / 0 issues**.
- Card-ID audit: **530/530 / 0 issues**.
- Counter-state audit: **480 gameplay cards / 349 Moves / 0 issues**.
- Card-effect audit: **29 test Superstars / 332 gameplay cards / 196 effect-bearing cards / 0 issues**.
- Economy smoke: **60 packs / 300 cards / 0 duplicate Entrance pulls / 0 foil-first failures**.
- Released-roster soak: **25 released Superstars / 6,000 matches / 0 stalls / 27.09 average turns / 5,475 pins / 525 submissions**.
- Released + RAW pre-release soak: **29 test Superstars / 8,120 matches / 0 stalls / 26.58 average turns / 7,412 pins / 708 submissions**.
- Full authored-roster soak: **50 Superstars / 4,900 matches / 0 stalls / 26.05 average turns / 4,638 pins / 262 submissions**.
- Dead-turn audit: **2,450 matches / 4.39 passes per match / maximum consecutive pass streak 4**.
- Custom-front artwork audit: **530 collector cards / 493 missing custom fronts**. Missing authored fronts correctly use the canonical fallback presentation.
- Active hidden pre-release certification scope remains **currently released content + RAW Series 1 only**.
- Profile schema remains **30**.

## v0.13.33 certification focus
- **EVO1-034** retains its existing id, values and effects and is renamed **Double Foot Stomp**.
- **RAW1-041** is absent from gameplay data and the collector manifest; RAW Series 1 is gap-free through **RAW1-040**.
- **Wheelbarrow Suplex — SVS1-053** and **Test of Strength — HOF1-092** match their approved shared profiles.
- **André’s Choke — HOF1-090** and **André’s Bear Hug — HOF1-091** are Rare André-exclusive Trademarks, with two copies of each in André’s 60-page authored deck.
- **Macho’s Double Axe Handle — HOF1-093** owns Savage’s former Double Axe Handle setup rider; Savage runs three copies plus one generic Double Axe Handle in his 60-page deck.
- The shared **Double Axe Handle** remains C4/D6 and grounds the opponent with no Savage-specific rider.
- No release-gating, economy, Superstar base-stat, chase/pity, mode-rule or profile-schema changes are included.
