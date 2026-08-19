# WWE Legacy v0.13.46 — Build Certification

**Home Season Title Consistency Hotfix**

- **587/587 regression tests pass.**
- Validation: **58 Superstars / 58 decks / 533 gameplay cards / 0 orphans / 0 issues**.
- Flow audit: **58 Superstars / 0 issues**.
- Card-ID audit: **591/591 / 0 issues**; Evolution Series 1 remains gap-free through **EVO1-074** and Worlds Collide Series 1 through **WC1-064**.
- Counter-state audit: **533 gameplay cards / 0 issues**; all 58 authored decks remain 60 pages / 12 Momentum with full accessible Counter-State and Submission-target coverage.
- Card-effect audit: **41 test Superstars / 416 gameplay cards / 259 effect-bearing cards / 0 issues**.
- Custom-front artwork audit remains **591 collector cards / 553 missing custom fronts**; this is unchanged from v0.13.45 and is expected while authored fallback presentation remains active.
- Profile schema remains **31**.

## v0.13.46 certification focus
- The Home Season destination now renders **SEASON ONE** through the exact same `homeHubSplitTitle()` component used by **DECK LAB** and the other Home destinations.
- The final CSS contract gives the Season title and Deck Lab title the same **1.48rem** standard Home size, **.9** line height, **5px** title margin and the same **390px → 1.35rem** small-phone fallback.
- Season colours remain locked to white **SEASON** + cyan **ONE** (`#55e4ff`), while Deck Lab continues to use its own purple accent through the same component.
- The previous `season-home-title` markup is removed from `renderMainMenu()`, so the old Season-specific **max-width:600px** override can no longer shrink the Home Season title independently on iPhone widths such as 393px.
- Older regression tests that asserted the retired `season-home-title` class were updated to assert the new shared component without weakening their original Season-home behavior checks.
- The Season tab hero/reward road is untouched.
- No gameplay, card data, balance, economy, booster, deck, collector, reward, profile-schema or release-calendar behavior changed.

## Retained gameplay certification
Because v0.13.46 changes only Home markup/CSS plus cache/version stamps, the gameplay simulation certification from v0.13.45 remains applicable and unchanged:
- Released-roster soak: **25 released Superstars / 6,000 matches / 0 stalls / 27.09 average turns / 5,476 pins / 524 submissions**.
- Released + RAW + Worlds Collide pre-release soak: **41 test Superstars / 16,400 matches / 0 stalls / 25.38 average turns / 15,150 pins / 1,250 submissions**.
- Full authored-roster soak: **58 Superstars / 6,612 matches / 0 stalls / 25.37 average turns / 6,265 pins / 347 submissions**.
- Dead-turn audit: **3,306 matches / 4.16 passes per match / maximum consecutive pass streak 4**.
