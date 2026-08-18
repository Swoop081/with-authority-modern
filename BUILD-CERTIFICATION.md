# WWE Legacy v0.13.37 — Build Certification

**Hub + Selector Consistency Pass**

- **549/549 regression tests pass.**
- Validation: **50 Superstars / 50 decks / 481 gameplay cards / 0 orphans / 0 issues**.
- Flow audit: **50 Superstars / 0 issues**.
- Card-ID audit: **531/531 / 0 issues**.
- Counter-state audit: **481 gameplay cards / 350 Moves / 0 issues**.
- Card-effect audit: **29 test Superstars / 332 gameplay cards / 196 effect-bearing cards / 0 issues**.
- Economy smoke: **60 packs / 300 cards / 0 duplicate Entrance pulls / 0 foil-first failures**.
- Released-roster soak: **25 released Superstars / 6,000 matches / 0 stalls / 27.09 average turns / 5,476 pins / 524 submissions**.
- Released + RAW pre-release soak: **29 test Superstars / 8,120 matches / 0 stalls / 26.58 average turns / 7,413 pins / 707 submissions**.
- Full authored-roster soak: **50 Superstars / 4,900 matches / 0 stalls / 26.05 average turns / 4,639 pins / 261 submissions**.
- Dead-turn audit: **2,450 matches / 4.38 passes per match / maximum consecutive pass streak 4**.
- Custom-front artwork audit: **531 collector cards / 493 missing custom fronts**; missing authored fronts continue to use the canonical fallback presentation.
- Profile schema remains **31**.

## v0.13.37 certification focus
- Live Events selection cards remain usable at iPhone widths with no Superstar-art/timer/CTA overlap.
- Shared Superstar selection obeys select-first / flip-second interaction across Exhibition-style selectors and new Deck Lab / Live Event integrations.
- Season current-tier auto-focus coexists with a persistent compact Season + Free Booster sticky control area.
- Theme stat tiles use full background fills with readable contrast.
- King of the Ring hero shrinks to content height and no longer preserves unused portrait space.
- No unrelated gameplay, content or economy changes are included.
