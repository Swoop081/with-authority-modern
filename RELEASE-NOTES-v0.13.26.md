# WWE Legacy v0.13.26 — Season Road iPhone Geometry Hotfix

This targeted presentation hotfix repairs the Season 1 Road regression observed during live iPhone Safari testing after v0.13.24/v0.13.25.

## Season Road iPhone fix
- The root cause was the current-tier `scrollIntoView()` call interacting badly with the alternating half-width reward nodes in Safari. Safari could horizontally pan the whole page to bring a right-side node into view, clipping the left side of the Final Boss hero/countdown and making alternating tiers appear to be separated by huge blank gaps.
- Current-tier focus is now **vertical-only** using `window.scrollTo()` and explicitly restores horizontal position to `0`.
- The Season screen, game root and road containers are explicitly horizontally contained on the Season route.
- On iPhone widths, the reward road becomes a **full-width compact vertical timeline** rather than alternating half-width cards. Every tier remains visible in sequence, the spine stays inside the viewport, and connectors cannot force horizontal overflow.
- Mobile reward nodes, tier medallions, typography and spacing are reduced so multiple rewards remain visible at once.
- The Final Boss hero is shorter on iPhone, the three command stats are compacted, the Season-end countdown is contained, and the free-booster strip is reduced in height.
- The screen still auto-focuses the player's current tier on entry and retains the colourful 100-tier Season Road identity introduced in v0.13.24.

## Unchanged systems
- v0.13.25 Brock Action reliability fixes remain intact.
- No gameplay balance, card data, Superstar HP, Championship Road rules, KOTR rules/rewards, Money in the Bank rules, Store prices, booster odds, Superstar chase/pity, release dates, deck blueprints or save schema changed.
- Profile schema remains **30**.
