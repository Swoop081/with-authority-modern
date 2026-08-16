# WWE Legacy v0.12.52 — Brock Lesnar: Suplex City Pass

v0.12.52 adds a bespoke repeatable German-Suplex identity and a second Special to Brock Lesnar while leaving the settled global match systems unchanged.

## Added — Brock's German
- C5 / D8 / Strength 2.
- Brock-exclusive Grapple.
- One Damage stronger than the shared German Suplex.
- On connect, draw another Brock's German from the Playbook if one remains.
- Every connected copy can repeat this search with no artificial chain cap beyond available/legal copies.
- Counts as `German Suplex` for Suplex City and other card effects.
- Generic German Suplex and Brock's German share a combined five-copy deck family cap.
- Brock's recommended deck uses five Brock's German.

## Added — My Name Is Paul Heyman
Once per match, after Brock connects with Brock's German during the current Control sequence:
- search F-5 if it is not already in hand;
- Brock's next F-5 this Control costs 2 less.

Brock retains The Beast Incarnate. Different once-per-match Specials are now tracked independently by card ID, so Brock can use both Specials in the same match without allowing repeat use of either individual Special.

## Suplex City sync
Suplex City now rewards the first two connected Moves that count as German Suplex with +2 Adrenaline each. Engine `connectNamed` matching recognizes `countsAs` aliases. The old Suplex City draw effect was removed because Brock's German now owns the repeat-draw chain.

## Collection / deck data
- Added SS1-140 Brock's German.
- Added SS1-141 My Name Is Paul Heyman.
- Active gameplay cards: 434.
- Active collectibles: 484.
- Brock recommended deck remains 60 pages / 12 Momentum.

## Balance
Exact 24,500-match run:
- Brock 59.7% (585-395), 0 stalls.
- Overall average 25.30 turns; 92.0% pin / 8.0% submission.
- Rock 72.9% / Goldberg 73.2% remain prestige-tier.

## Certification
- 237/237 tests pass.
- Validation: 50 Superstars / 50 decks / 434 gameplay cards / 0 orphans / 0 issues.
- Card-ID audit: 484/484 / 0 issues.
- Flow audit: 50 Superstars / 0 issues.
- Counter-chain audit: 2,450 matches / 0 stalls / 733 depth-2+ / 0 illegal non-Punch-Elbow recursive chains.

No global pin, submission, Counter, retained-Control draw, Momentum, Entrance, Adrenaline, roster HP, economy or presentation rules changed in v0.12.52.
