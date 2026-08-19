# WWE Legacy v0.13.50 — Build Certification

**Season Fixed Viewport Hotfix**

- **599/599 regression tests pass.**
- Validation: **58 Superstars / 58 decks / 533 gameplay cards / 0 orphans / 0 issues**.
- Flow audit: **58 Superstars / 0 issues**.
- Card-ID audit: **591/591 / 0 issues**; Evolution Series 1 remains gap-free through **EVO1-074** and Worlds Collide Series 1 through **WC1-064**.
- Counter-state audit: **533 gameplay cards / 0 issues**; all 58 authored decks remain 60 pages / 12 Momentum with full accessible Counter-State and Submission-target coverage.
- Card-effect audit: **41 test Superstars / 416 gameplay cards / 259 effect-bearing cards / 0 issues**.
- Custom-front artwork audit remains **591 collector cards / 553 missing custom fronts**; this is expected while authored fallback presentation remains active.
- Profile schema remains **31**.

## v0.13.50 certification focus
- The Season `<main>` surface is now `position: fixed` between the global top game bar and bottom navigation, so it is independent of the document's scroll coordinate space.
- The full **Season One** hero with The Rock, the three **Current Tier / Rewards Ready / Universe Points** tiles, and the **Free Booster** strip remain outside the vertical scroller and cannot be pushed off screen by iPhone Safari scroll restoration.
- The lower `season-road-scroll` is the only Season vertical scrolling surface. The 100-tier road heading now lives inside that moving road content.
- Entering/rerendering Season explicitly clears `documentElement`, `body`, and `document.scrollingElement` offsets as an additional Safari safeguard.
- Current-tier auto-focus remains confined to the internal road scroller and does not use page-level `window.scrollTo` or `scrollIntoView`.
- v0.13.48 Home **SEASON ONE / DECK LAB** title parity remains intact.
- v0.13.47 Safari card-art load-flicker protection remains intact.
- No gameplay, card data, balance, economy, booster, deck, collector, reward, profile-schema, or release-calendar behavior changed.

## Retained gameplay certification
Because v0.13.50 is presentation-only plus cache/version stamps, the gameplay simulation certification from v0.13.45 remains applicable and unchanged:
- Released-roster soak: **25 released Superstars / 6,000 matches / 0 stalls / 27.09 average turns / 5,476 pins / 524 submissions**.
- Released + RAW + Worlds Collide pre-release soak: **41 test Superstars / 16,400 matches / 0 stalls / 25.38 average turns / 15,150 pins / 1,250 submissions**.
- Full authored-roster soak: **58 Superstars / 6,612 matches / 0 stalls / 25.37 average turns / 6,265 pins / 347 submissions**.
- Dead-turn audit: **3,306 matches / 4.16 passes per match / maximum consecutive pass streak 4**.
