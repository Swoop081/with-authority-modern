# WWE Legacy: Collectible Card Game — v0.12.64
## Momentum Front Exception Pass

v0.12.64 supersedes v0.12.63 as the current working baseline.

### Momentum authored-front exception
- Method Momentum cards are explicitly exempt from the generic missing-custom-front fallback introduced in v0.12.63.
- Strength, Strike, Technical and Agility Momentum continue to use the existing live WWE Legacy Momentum fronts authored in the UI, including their canonical method colours, arena-line treatment and +1 presentation.
- Momentum fronts no longer depend on a private/custom WebP being present.
- Tapping/flipping a Momentum card still shows its canonical WWE Legacy rules/details back.

### Other collectible cards
- v0.12.63 behaviour remains unchanged for Moves, Entrances, Specials, Managers, Actions and Supports: an installed custom front overlays the front; if that image is missing or fails, the canonical rules/details back remains visible instead of a blank rectangle.
- Superstar presentation is unchanged.

No gameplay, balance, ownership, deck, booster or collector-data rules are changed.

### Certification
- 297/297 automated tests pass.
- Validation: 50 Superstars / 50 decks / 435 gameplay cards / 0 orphans / 0 issues.
- Flow audit: 50 Superstars / 0 issues.
- Card-ID audit: 485/485 / 0 issues.
