# WWE Legacy v0.13.70 — Build Certification

**Build:** v0.13.70 — Main Event Hero Positioning Pass  
**Frozen:** 20 August 2026

## Automated regression
- **678 / 678 tests pass** in the source tree.
- New v0.13.70 regression verifies the matchup screen is full-bleed, excludes hidden global chrome spacing, preserves the established show-logo size, and separates the matchup heading from the logo.
- v0.13.69 Superstar-carousel continuity, Pack Complete rarest-card centering, and Live Event CTA containment remain intact.

## Main Event / iPhone presentation certification
- `matchup` is excluded from generic main-content padding reserved for the fixed global status chrome, eliminating the empty black band when that chrome is hidden.
- The matchup section begins at the viewport origin and paints its presentation background through the safe-area region.
- Show-logo size is unchanged: **112px** at the standard matchup breakpoint and **100px on phones**.
- The hero stack uses safe-area-aware top spacing to position the show identity in the upper third rather than using a blank top band.
- Negative spacing between the show logo and matchup heading is removed.
- `TONIGHT’S` has a dedicated separated line beneath the show logo; `MAIN EVENT`, Superstar cards, VS and START MATCH retain their established hierarchy.

## Data validation
- **62 Superstars**
- **62 decks**
- **562 gameplay cards**
- **0 orphan cards**
- **0 validation issues**

## Flow / collector audits
- Flow audit: **62 Superstars / 0 issues**
- Card-ID audit: **624 / 624 collector cards / 0 issues**
- Counter-State audit: **562 gameplay cards / 62 decks / 0 issues**
- Card-effect audit: **45 internal-test Superstars / 443 scoped gameplay cards / 281 effect-bearing cards / 0 issues**

## Artwork audit
- Collector cards audited: **624**
- Custom fronts currently missing: **584**
- Missing-front count is unchanged from v0.13.69.

## Simulation carry-forward
This pass changes presentation only. Authored decks and gameplay values are unchanged, so the inherited gameplay simulation certification carries forward:
- Full-roster smoke balance: **3,782 matches / 0 stalls / 25.24 average turns**
- Internal/pre-release balance: **19,800 matches / 0 stalls / 25.12 average turns**
- Diesel internal/pre-release cross-field: **880 matches / 59.4% win rate / 0 stalls / 24.4 average turns**

## Release scope
No gameplay, balance, deck composition, collector numbering, pack odds, economy, progression, rewards or release-gating changes are included. All v0.13.69 and earlier accepted systems remain authoritative.
