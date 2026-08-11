# WWE Legacy v0.11.31 — Always Start New Screens at the Top

## Navigation consistency

- Every in-app screen transition now resets the viewport to the absolute top (`0,0`).
- The reset is applied immediately and again after the replacement screen paints, preventing mobile Safari from restoring the prior screen's scroll position after large DOM changes.
- Browser automatic scroll restoration is disabled for the single-page app so navigation is deterministic.
- Same-screen interactions (card flips, filters, pack reveals, roster selection, etc.) keep their current scroll position; only an actual app-screen change triggers the reset.

## Scope

- No gameplay, card, deck, collection, balance, collector-number or Card Art Studio data changes.
