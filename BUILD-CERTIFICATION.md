# WWE Legacy v0.13.26 — Build Certification

**Season Road iPhone Geometry Hotfix**

- **488/488 regression tests pass.**
- Validation: **50 Superstars / 50 decks / 462 gameplay cards / 0 orphans / 0 issues**.
- Flow audit: **50 Superstars / 0 issues**.
- Card-ID audit: **512/512 / 0 issues**.
- Counter-state audit: **462 gameplay cards / 331 Moves / 0 issues**.
- Card-effect audit: **29 test Superstars / 324 gameplay cards / 190 effect-bearing cards / 0 issues**.
- Economy smoke: **60 packs / 300 cards / 0 duplicate Entrance pulls / 0 foil-first failures**.
- Released-roster soak: **25 released Superstars / 6,000 matches / 0 stalls / 27.18 average turns / 5,480 pins / 520 submissions**.
- Released + RAW pre-release soak: **29 test Superstars / 8,120 matches / 0 stalls / 26.64 average turns / 7,417 pins / 703 submissions**.
- Full authored-roster soak: **50 Superstars / 4,900 matches / 0 stalls / 26.05 average turns / 4,643 pins / 257 submissions**.
- Dead-turn audit: **2,450 matches / 4.39 passes per match / maximum consecutive pass streak 4**.
- Custom-front artwork audit: **512 collector cards / 475 missing custom fronts**. This is the existing artwork backlog and is not a v0.13.26 regression.
- Active hidden pre-release scope remains **currently released content + RAW Series 1 only**.
- Profile schema remains **30**.

## v0.13.26 certification focus
- Replaces Season current-tier `scrollIntoView()` with a **vertical-only `window.scrollTo()` focus** that explicitly keeps horizontal scroll at zero.
- Adds Season-route horizontal containment to body/main/game/Season Road containers.
- At iPhone widths, the 100-tier road is a **full-width compact timeline** rather than alternating half-width cards, preventing Safari from panning the whole page sideways.
- All tier nodes remain in continuous sequence with a contained left-side spine; mobile connectors cannot create horizontal overflow.
- Mobile Final Boss hero height, command-band spacing, countdown sizing, free-booster CTA and tier-card height are reduced so progression content appears substantially sooner.
- v0.13.25 Brock Action fixes remain intact and covered by regression tests.
- No gameplay/card balance, Superstar HP, Method limits, Championship Road rules, KOTR rules/rewards, Money in the Bank rules, Store prices, duplicate values, booster rarity weights, Superstar chase odds, global pity behavior, release dates, deck blueprints or artwork inventory changed.
