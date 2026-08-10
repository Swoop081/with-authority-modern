# WWE Legacy: Collectible Card Game — v0.9.7

## CM Punk identity pass
- Superstar Ability renamed from Counter Culture to Pipe Bomb.
- Pipe Bomb keeps the approved effect: the first successful Counter grants +1 Technical Momentum.
- Entrance renamed from Best in the World to It's Clobbering Time!
- Shoulder Up is removed from CM Punk's starter.
- Added CM Punk-exclusive Special: Best in the World.
  - Pin response: stop the pin and take Control.
  - Superstar restriction is enforced by the engine, not just printed on the card.

## Method-counter prototype
- Removed Technical Reversal and Scramble Free from CM Punk's starter.
- Added Chain Wrestling x2:
  - Cost 3
  - Requires 1 Technical
  - Counter any Technical Move
  - Shared card
- Added Duck x1:
  - Cost 3
  - Requires 1 Strike
  - Counter any Strike Move
  - Shared card
- Method counters must still satisfy their own total-Momentum and method requirements.
- Method counters do not inherit extra positional counter coverage.
- Card backs explicitly print method-family counter coverage.

## Compatibility
- Legacy Technical Reversal and Scramble Free card identities remain in the collection for existing saves/decks, but CM Punk no longer uses them. They can be retired/replaced globally as each starter is reviewed.

## Certification
- 161/161 automated regression tests passing.
- 7,500-match matrix: 24.99 turns average, 0 stalls.
- Punk currently rises to 63.0% in the temporary mixed counter environment because he is the first Superstar receiving the broader method-counter package. Final roster balance should be evaluated after the counter family is rolled through the reviewed starters.
