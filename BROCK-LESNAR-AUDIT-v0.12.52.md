# WWE Legacy v0.12.52 — Brock Lesnar / Suplex City Audit

## Scope
v0.12.52 is a focused Brock Lesnar identity pass built on v0.12.51. It does not change the global match-flow, pin, submission, counter, Momentum, Entrance or Adrenaline systems.

## Brock's German
- Card ID: `brock-lesnar-brocks-german`
- Collector ID: `SS1-140`
- Brock-exclusive Move
- Cost 5 / Damage 8 / Strength 2
- Grapple / rear-control Counter state
- On connect: draw 1 `Brock's German` from the Playbook if one remains.
- There is no per-match chain cap: each connected copy may draw the next copy, so a player can continue the sequence for as many copies as are legally available and playable.
- `countsAs: ["German Suplex"]`, so Suplex City and future German-Suplex effects recognize it.
- Generic `German Suplex` and `Brock's German` share the `german-suplex` copy family with a combined maximum of five copies in a legal deck.
- Brock's recommended 60-page deck now runs five `Brock's German` and zero generic `German Suplex`.

### Comparison
- German Suplex: C5 / D7 / Strength 2
- Brock's German: C5 / D8 / Strength 2 + self-replacing Suplex City chain

## Suplex City
Brock's Superstar ability now reads:
> The first 2 times Brock connects with a Move that counts as German Suplex, gain +2 Adrenaline.

The previous ability-level German-Suplex tutor was removed because `Brock's German` now carries the repeat-draw behavior itself. Alias matching now honors a Move's `countsAs` list.

## My Name Is Paul Heyman
- Card ID: `special-brock-lesnar-paul-heyman`
- Collector ID: `SS1-141`
- Brock-exclusive Special
- Once per match, after Brock has connected with `Brock's German` during the current Control sequence:
  - search the Playbook for `F-5` if it is not already in hand;
  - Brock's next F-5 during that Control sequence costs 2 less.

This gives the German chain an offensive destination without adding raw damage to the Special itself.

## Multiple Brock Specials
Brock still keeps `The Beast Incarnate` as his defensive Special. Specials are now tracked by card ID rather than one global all-Special lock, allowing Brock to use each different once-per-match Special once in the same match. Duplicate copies of the same Special cannot bypass its once-per-match restriction.

## Recommended deck changes
The deck remains exactly 60 pages with 12 Momentum.
- German Suplex x4 -> Brock's German x5
- Ground and Pound x3 -> x2
- Belly-to-Belly Suplex x4 -> x3
- + My Name Is Paul Heyman x1
- The Beast Incarnate remains.

## Balance certification
### Brock-focused
1,960 matches across all 49 opponents, alternating sides:
- Win rate: 56.89%
- P1: 55.51%
- P2: 58.27%
- Average turns: 25.28
- Stalls: 0

### Exact 24,500-match roster run
- Brock: 585-395, 59.7%
- Brock pin wins: 466
- Brock submission wins: 119
- Brock average turns: 25.38
- Brock average winning HP: 35.9%
- Brock P1: 56.5%
- Brock P2: 62.9%

Overall field:
- 24,500 matches
- 0 stalls
- 25.30 average turns / 25 median
- 92.0% pin / 8.0% submission
- P1 win rate 48.30%
- Goldberg 73.2%, The Rock 72.9% remain the deliberate prestige tier.
- Brock at 59.7% is the strongest normal-roster result in this exact sample but remains inside the intended ~40–60% regular-roster band.

## Structural certification
- 237/237 automated tests pass.
- 50 Superstars / 50 decks / 434 gameplay cards / 0 orphans / 0 validation issues.
- 484/484 collector IDs / 0 issues.
- Flow audit: 50 Superstars / 0 issues.
- Counter-chain audit: 2,450 matches / 0 stalls / 733 depth-2+ exchanges / 0 non-Punch-Elbow depth-2+.
