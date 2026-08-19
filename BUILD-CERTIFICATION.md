# WWE Legacy v0.13.48 — Build Certification

**Home Season Title True Parity Hotfix**

- **592/592 regression tests pass.**
- Validation: **58 Superstars / 58 decks / 533 gameplay cards / 0 orphans / 0 issues**.
- Flow audit: **58 Superstars / 0 issues**.
- Card-ID audit: **591/591 / 0 issues**; Evolution Series 1 remains gap-free through **EVO1-074** and Worlds Collide Series 1 through **WC1-064**.
- Counter-state audit: **533 gameplay cards / 0 issues**; all 58 authored decks remain 60 pages / 12 Momentum with full accessible Counter-State and Submission-target coverage.
- Card-effect audit: **41 test Superstars / 416 gameplay cards / 259 effect-bearing cards / 0 issues**.
- Custom-front artwork audit remains **591 collector cards / 553 missing custom fronts**; this is expected while authored fallback presentation remains active.
- Profile schema remains **31**.

## v0.13.48 certification focus
- Home **SEASON ONE** and **DECK LAB** are both rendered by the literal same `homeHubSplitTitle()` output: `<strong class="legacy-command-title">`.
- The actual root cause of the persistent mismatch has been removed: the obsolete `.legacy-season-copy > strong` rule that forced only the Season instance onto `ui-monospace`, different tracking, and a glow no longer exists in the active stylesheet.
- A final shared `.legacy-command-title` contract pins one typography treatment across the Home hub: Inter/system sans stack, **1.48rem**, **.9** line-height, **-.045em** tracking, italic **1000** weight, uppercase, no text shadow, and the same **1.35rem** fallback at <=390px.
- Season keeps its existing palette via `--command-accent`: **SEASON** white / **ONE** cyan. Deck Lab remains white / purple.
- v0.13.47 Safari card-art load-flicker protection remains intact.
- No gameplay, card data, balance, economy, booster, deck, collector, reward, profile-schema, or release-calendar behavior changed.

## Retained gameplay certification
Because v0.13.48 is presentation-only plus cache/version stamps, the gameplay simulation certification from v0.13.45 remains applicable and unchanged:
- Released-roster soak: **25 released Superstars / 6,000 matches / 0 stalls / 27.09 average turns / 5,476 pins / 524 submissions**.
- Released + RAW + Worlds Collide pre-release soak: **41 test Superstars / 16,400 matches / 0 stalls / 25.38 average turns / 15,150 pins / 1,250 submissions**.
- Full authored-roster soak: **58 Superstars / 6,612 matches / 0 stalls / 25.37 average turns / 6,265 pins / 347 submissions**.
- Dead-turn audit: **3,306 matches / 4.16 passes per match / maximum consecutive pass streak 4**.
