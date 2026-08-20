# WWE Legacy v0.13.65 — Build Certification

**Build:** v0.13.65 — Shared Move Triple Pass  
**Frozen:** 20 August 2026

## Automated regression
- **668 / 668 tests pass**
- Dedicated v0.13.65 regressions lock all three new gameplay profiles, collector identities, Card Studio placements, and the separation between the generic Diving Shoulder Block and Ultimate Warrior’s exclusive card.

## Data validation
- **62 Superstars**
- **62 decks**
- **562 gameplay cards**
- **0 orphan cards**
- **0 validation issues**

## Flow / collector audits
- Flow audit: **62 Superstars / 0 issues**
- Card-ID audit: **624 / 624 collector cards / 0 issues**
- Evolution — Series 1: **75 cards, EVO1-001 through EVO1-075, gap-free**
- Hall of Fame — Series 1: **94 cards, HOF1-001 through HOF1-094, gap-free**
- SmackDown — Series 1: **38 cards, SD1-001 through SD1-038, gap-free**
- Counter-State audit: **562 gameplay cards / 62 decks / 0 issues**
- Submission target coverage remains complete; Vertical Boston Crab is a Back-targeting submission with Rear Control counter state.
- Card-effect audit: **45 internal-test Superstars / 443 scoped gameplay cards / 281 effect-bearing cards / 0 issues**

## Card certification
### Vertical Boston Crab — EVO1-075
- **2★ Uncommon**
- **Cost 6 / Damage 0**
- **Technical 2**
- **Submission / Rear Control**
- Grounded opponent only.
- **+4 persistent Back damage per successful turn.**
- Shared / booster-only; no Superstar ownership.

### Diving Shoulder Block — HOF1-094
- **1★ Common**
- **Cost 4 / Damage 6**
- **Agility 1**
- **Aerial / Diving Aerial**
- Grounds opponent.
- Shared / booster-only; no Superstar ownership.
- Exists independently from `ultimate-warrior-diving-shoulder-block`, which remains a 3★ Ultimate Warrior-exclusive card with its prior gameplay unchanged.

### Springboard Roundhouse Kick — SD1-038
- **3★ Rare**
- **Cost 6 / Damage 9**
- **Agility 2 + Strike 1**
- **Aerial / Running Aerial**
- Grounds opponent.
- Shared / booster-only; no Superstar ownership.

None of the three new cards is installed in an authored Superstar deck in this pass.

## Simulation carry-forward
Because the authored 62 Superstar decks are unchanged, the most recent authored-deck gameplay simulation certification carries forward unchanged:
- Full-roster smoke balance: **3,782 matches / 0 stalls / 25.24 average turns**
- Internal/pre-release balance: **19,800 matches / 0 stalls / 25.12 average turns**
- Diesel internal/pre-release cross-field: **880 matches / 59.4% win rate / 0 stalls / 24.4 average turns**

## Artwork audit
- Collector cards audited: **624**
- Custom fronts currently missing: **584**
- The three new shared cards account for the three-card increase from v0.13.64 and use canonical fallback presentation until approved custom artwork is installed.
- Missing custom fronts remain expected and are not gameplay/data validation failures.

## Release scope
Evolution and Hall of Fame retain their existing live-set behavior. SmackDown retains its existing future-set gating and is not made player-facing early by this pass. All v0.13.64 and earlier accepted systems remain authoritative.
