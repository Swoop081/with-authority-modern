# WWE Legacy: Collectible Card Game — v0.12.58

## Mobile Readability + Card Presentation Pass

v0.12.58 supersedes v0.12.57. This release packages the second screenshot-driven iPhone UI pass.

### Launch / Season
- Rebuilt the launch Final Boss promotion after rejecting the v0.12.57 spacing treatment: Rock is restored to a deliberate left visual column, the central bleed is narrowed, and the headline/body copy are rebalanced so the full message fits.
- Season “Road to the Final Boss” Rock render is moved farther right and lower so his head does not sit beneath the countdown card or compete with the title.

### Collection / Cards
- Collection hero now reserves separate vertical space for title/copy, My Collection/Card Catalogue controls, and summary stats so controls no longer overlay text.
- Exhibition Superstar selector now preserves the complete collectible Superstar card front with contain scaling instead of cropping the artwork.
- Any non-Superstar/non-Momentum card without an exported custom front defaults to its rules/details face so Cost, Damage, requirements and effects remain immediately readable.

### Match presentation
- Tonight’s Main Event matchup screen fills the viewport from the top and shifts the logo/headline/cards/VS/CTA stack upward while preserving the minimal television graphic.
- Match Rewards booster wrapper is enlarged and uses the normal Series 1 treatment so wrapper text fits cleanly.

### Deck Lab / Play
- Every Deck Lab category is now a horizontal swipeable row of the actual cards currently in that section, with an Edit control for the existing category picker.
- Choose Your Path match-mode headings, straplines, descriptions and CTA copy are enlarged for iPhone readability.

### Challenges / Packs
- Challenges Set Progress tiles no longer show ownership percentages over the SummerSlam, Hall of Fame or Evolution logos. Ownership counts remain in the supporting text.
- Physical booster fronts no longer repeat the set name below an existing set logo; the Series label remains.

### Rules / data
No Superstar balance, deck composition, card-stat, pin, submission, counter, Momentum, Entrance economy, booster economy or Final Boss reward-road rules changed in this release.

### Certification
- Regression suite: 279/279 tests pass.
- Validation: 50 Superstars / 50 decks / 435 gameplay cards / 0 orphans / 0 issues.
- Flow audit: 50 Superstars / 0 issues.
- Card-ID audit: 485 cards / 485 manifest entries / 0 issues.
- Custom-art audit: 485 collectible cards / 449 not-yet-exported custom fronts (unchanged content gap; unfinished cards now default to their rules/details face).
