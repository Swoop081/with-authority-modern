# WWE Legacy v0.13.19 — Build Certification

**Superstar Unlock Progression + Chase Rate Pass**

- **459/459 regression tests pass.**
- Validation: **50 Superstars / 50 decks / 462 gameplay cards / 0 orphans / 0 issues**.
- Flow audit: **50 Superstars / 0 issues**.
- Card-ID audit: **512/512 / 0 issues**.
- Counter-state audit: **462 gameplay cards / 331 Moves / 0 issues**.
- Card-effect audit: **29 test Superstars / 324 gameplay cards / 190 effect-bearing cards / 0 issues**.
- Economy smoke: **60 packs / 300 cards / 0 duplicate Entrance pulls / 0 foil-first failures**.
- Released + RAW pre-release soak: **29 test Superstars / 8,120 matches / 0 stalls / 26.67 average turns / 7,415 pins / 705 submissions**.
- Dead-turn audit: **2,450 matches / 4.39 passes per match / maximum consecutive pass streak 4**.
- Secondary-unlock audit: **28 normal released + RAW pre-release Superstars** checked against the lean one-Finisher / one-Trademark / one-Action cap, with **0 manufactured secondary decks / 0 Superstar-specific Entrance auto-grants / 0 issues**.
- Art audit: **512 collector cards / 475 unfinished custom fronts** (known artwork backlog; no artwork requirement changed in this release).
- Active hidden pre-release scope remains **currently released content + RAW Series 1 only**.

## v0.13.19 certification focus
- First Superstar still receives the complete authored 60-page onboarding deck.
- Later normal Superstar unlocks grant the Superstar card plus at most one authored Finisher, one Trademark and one Action.
- Later unlocks never grant shared filler, Lead Off pages, Once Too Often, a Superstar Entrance, or a manufactured 60-page deck.
- Deck Lab uses only cards the player actually owns when building toward the authored recommended blueprint.
- Newly collected recommended cards and Superstar-specific Entrances remain eligible for Deck Assistance upgrades.
- Existing v0.13.18 ownership and complete saved decks are preserved; the correction applies prospectively without clawback.
- Superstar natural chase is **2% per eligible pack** with a **100-pack per-set hard pity**.
- Normal booster rarity weights remain **50/30/15/5** and Superstar chase remains separate from those slot weights.
- Booster Superstar unlock grants remain deferred until all five pulls are rolled.
- Profile schema remains **30**.
- No gameplay balance, HP, economy prices, duplicate values, release dates or artwork assets changed.
