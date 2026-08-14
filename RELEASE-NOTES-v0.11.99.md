# WWE Legacy: Collectible Card Game — v0.11.99
## Match HUD + Play Pile Inspector Fix

This is a focused iPhone match-screen presentation release built on v0.11.98. No cards, decks, balance values, collector numbers, booster pools, or Superstar designs were changed.

### HUD portrait correction
- The 1200×400 Card Art Studio headshot master now **fills** the live portrait viewport rather than being contained inside it.
- The portrait lane is slightly wider and taller while HP remains in its own dedicated lane.
- Player and CPU portraits use the same centred crop rules, preventing the previous undersized/head-only presentation caused by the contain + transform combination.
- The Dynamic Island/status-bar safe area from v0.11.92 remains intact.

### Play Pile card inspection
- Every visible Play Pile card is now a real tappable inspection target on iPhone.
- Removed invalid nested-button markup (a clickable wrapper previously contained the collectible card's own button), which could cause Mobile Safari to ignore the outer tap handler.
- The Play Pile hit target is now a non-nested `role="button"` container with touch and keyboard activation.
- The collectible inside the Play Pile does not intercept pointer events.
- Tapping a Play Pile card opens the **same front-of-screen modal presentation used by Superstar cards**.
- Tap the enlarged card to flip front/back; tap outside it to close.

### Validation
Run `npm test`, `npm run validate`, `npm run card-ids`, and `npm run flow` for the canonical release checks.
