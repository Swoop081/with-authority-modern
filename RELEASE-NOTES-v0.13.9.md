# WWE Legacy v0.13.9 — Season + Live Event Viewport Containment Hotfix

Presentation-only mobile containment pass based on iPhone screenshots.

## Season daily booster

- The purple Daily Login Booster control now overrides older compact-strip sizing rules and occupies the full available Season content width.
- The control remains a single line in both states: **CLAIM FREE BOOSTER** when available, or **NEXT FREE BOOSTER IN <countdown>** while waiting.
- No reward timing or booster logic changed.

## Live Event tower detail

- The red Start/Fight CTA can no longer inherit the global 360px minimum width inside the narrow Superstar copy column. It is explicitly viewport-contained and stretches only within its own panel.
- The selected Superstar card uses a bounded percentage/fixed maximum width on phone layouts.
- The tower hero Superstar render is reduced and clipped inside the hero panel rather than extending beyond the page. The Powerhouse Collision hero remains intentionally larger than other towers, but is also contained.
- The accepted Event Route, timer, tower copy, opponent-card layout and overall screen composition are unchanged.

## Scope

No gameplay, balance, cards, decks, economy, progression, release gates, rewards, save data or artwork assets changed.
