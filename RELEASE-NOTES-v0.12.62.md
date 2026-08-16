# WWE Legacy: Collectible Card Game — v0.12.62

## Daily Booster Button Pass

v0.12.62 supersedes v0.12.61 and applies the screenshot-directed Season Daily Login Booster cleanup.

### Season / Daily Booster
- Removes the separate visible `Daily Login Booster` status copy from beneath the Final Boss hero.
- Leaves exactly one full-width purple control in that space.
- When the daily booster is available, the button reads **Claim Pack**.
- When it is unavailable, the button shows only the live countdown until the next pack is available, with no `Next`, `Free Booster`, or other explanatory copy.
- Keeps the unavailable state non-interactive while retaining the purple button treatment.
- Claiming the available pack still launches the existing standard sealed-pack / rip / reveal flow and returns to Season afterward.

### Gameplay / Content
- No gameplay, balance, card, deck, collection, Season reward, progression, economy, or Final Boss art changes from v0.12.61.

## Certification
- 291 / 291 automated tests pass.
- Validation: 50 Superstars / 50 decks / 435 gameplay cards / 0 orphans / 0 issues.
- Flow audit: 50 Superstars / 0 issues.
- Card-ID audit: 485 cards / 485 manifest entries / 0 issues.
