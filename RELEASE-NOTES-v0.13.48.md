# WWE Legacy v0.13.48 — Home Season Title True Parity Hotfix

## Fix
- Fixes the Home **SEASON ONE** heading above Deck Lab so it is genuinely the same typography as the **DECK LAB** Home destination title.
- Root cause: v0.13.46 did reuse the same `homeHubSplitTitle()` helper, but an older CSS rule — `.legacy-season-copy > strong` — still matched the shared `<strong>` only when it sat inside the Season card. That rule forced `ui-monospace`, different tracking and a glow, so the Season instance still looked different even though the markup helper was shared.
- The obsolete Season-only direct-`strong` rule has now been removed from the cascade rather than covered with another Season-specific approximation.
- `SEASON ONE` and `DECK LAB` now use the literal same `<strong class="legacy-command-title">` component and one final title contract: Inter/system sans stack, 1.48rem size, .9 line-height, -.045em tracking, italic 1000 weight, uppercase and no text shadow, with the same 1.35rem <=390px fallback.
- Existing colours are retained through `--command-accent`: **SEASON** stays white and **ONE** stays cyan; Deck Lab remains white + purple.

## Scope
Presentation-only. No gameplay, balance, economy, card data, deck, collector, reward, profile-schema, or release-calendar changes.
