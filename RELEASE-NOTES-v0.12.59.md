# WWE Legacy: Collectible Card Game — v0.12.59

## Pin Count + Run Screen Repair

v0.12.59 supersedes v0.12.58 and packages the post-release fixes requested from the current iPhone build.

### Pin presentation
- Failed pins against a defender who is still in the green health zone now present a **1-count → KICK OUT** sequence instead of always teasing a two-count.
- Green-health pin-escape Specials likewise break the count after one before showing the Special-card escape presentation.
- Amber/red-health failed pins retain the existing **1 → 2 → KICK OUT** drama.
- Successful pins retain the existing full **1 → 2 → 3** sequence.
- This changes presentation timing only; pin chance and match-outcome calculation are unchanged.

### Climb the Ladder repair
- Branch/era tabs are moved out of the positioned hero-copy container so they anchor correctly inside the hero instead of clipping beneath the top gamebar.
- Mobile hero spacing is rebalanced to leave a clear title area, branch row, and summary row.
- Active-run `Fight Rung` CTA can no longer inherit the global oversized `.start-match` minimum width, preventing it from overflowing the command panel.
- Run command content is explicitly constrained to its panel on iPhone.

### Championship Road repair
- Applies the same branch-selector anchoring fix so Current Era / Golden Era / Attitude Era / Hall of Fame controls stay fully visible.
- Restores clean mobile hero spacing and keeps the summary row contained.
- Setup Superstar cards are slightly larger and remain fully visible while the Start Road CTA stays contained.
- Active Championship Road command CTAs use the same overflow-safe sizing as Climb the Ladder.

### Rules / data
No pin probability, pin-success calculation, Superstar balance, deck composition, card-stat, submission, counter, Momentum, Entrance economy, booster economy or Final Boss reward-road rules changed in this release.

### Certification
- Regression suite: 283/283 tests pass.
- Validation: 50 Superstars / 50 decks / 435 gameplay cards / 0 orphans / 0 issues.
- Flow audit: 50 Superstars / 0 issues.
- Card-ID audit: 485 cards / 485 manifest entries / 0 issues.
- Custom-art audit: 485 collectible cards / 449 not-yet-exported custom fronts (unchanged art backlog from v0.12.58; unfinished cards continue to use the rules/details fallback).
