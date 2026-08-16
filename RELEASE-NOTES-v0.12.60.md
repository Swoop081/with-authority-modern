# WWE Legacy: Collectible Card Game — v0.12.60

## Season + Deck Lab Cleanup Pass

v0.12.60 supersedes v0.12.59 and packages the latest screenshot-driven mobile cleanup pass.

### Launch / Final Boss
- Enlarges the existing dedicated The Rock — Final Boss launch render to roughly twice its previous visual scale while preserving the right-side headline/copy area.
- Keeps the supplied Rock artwork unchanged; this is presentation/layout only.

### Deck Lab
- Repairs the `Choose Your Superstar` roster screen so the actual collectible Superstar card and its status/name/deck copy occupy separate columns instead of overlapping.
- Single-owned-Superstar layouts are centered and use the available iPhone width intentionally.

### Season
- Pulls The Rock inward/left on `The Road to the Final Boss` hero so he no longer sits detached against the far-right edge.
- Replaces the Daily Login Booster block with one full-width purple state button: `Claim Free Booster` when ready, otherwise `Next Free Booster · <timer>`.
- Compacts the Season Command Center into short readable stat rows, preserving Current Tier, Season XP, Universe Points, Next Drop, and Tier Progress without the previous large dead vertical areas.

### Challenges
- Removes set-name text from the SummerSlam / Hall of Fame / Evolution progress tiles so the show logos remain unobstructed; collection counts remain below the branding.

### Gameplay
- No gameplay, pin probability, match outcome, Superstar balance, deck composition, card-stat, submission, counter, Momentum, Entrance-economy, booster-economy, or Season-reward rules changed from v0.12.59.

## Certification
- 289 / 289 automated tests pass.
- Validation: 50 Superstars / 50 decks / 435 gameplay cards / 0 orphans / 0 issues.
- Flow audit: 50 Superstars / 0 issues.
- Card-ID audit: 485 cards / 485 manifest entries / 0 issues.
- Custom-art audit: 449 unfinished exported fronts, unchanged from v0.12.59.
