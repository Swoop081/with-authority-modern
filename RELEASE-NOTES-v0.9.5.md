# WWE Legacy: Collectible Card Game — v0.9.5

## Full Move counter legality audit
- Fixed a rules hole where a Move could be offered/played as a Counter solely because its `counters` relationship matched the incoming Move Type.
- Counter Moves now must also satisfy their own printed legality:
  - total Momentum cost,
  - method Momentum requirements,
  - Superstar restriction,
  - wrestler location,
  - opponent posture,
  - same-location rules,
  - stunned/playable-while-stunned rules.
- Counter windows still bypass only the normal ACTION-phase / current-Control requirement, because the defender is responding out of Control.
- Counter Any Special pages remain purpose-built defensive responses and are not incorrectly forced through Move cost gates.
- Offensive counter Moves still become genuine counter-attacks and open the existing counter-to-counter response window once legally played.

## Roundhouse Kick regression
- CM Punk's Roundhouse Kick is cost 3 and requires 1 Strike.
- It is no longer legal as a Turn-1 counter with only 1 Total Momentum.
- Reaching 3 Total Momentum without 1 Strike is still insufficient.
- It becomes a legal counter only when both total and method gates are met.

## Whole-card-pool certification
- Audited all 429 collectible Moves.
- 341 Moves have at least one counter relationship.
- 330 offensive Moves can counter at least one Move Type; 11 are defensive-only counter Moves.
- The automated audit verifies relationship, Superstar, total Momentum, method, location, posture and stun gates across the full counter-capable Move pool.

## Post-fix pacing / roster calibration
- Stricter legal counters shortened matches, so pacing was restored with HP-only durability tuning rather than weakening the corrected rule.
- 7,500-match 25-Superstar matrix:
  - 25.26 turns average
  - 0 stalls
  - 11.9% Moves countered
  - 3.80 average losing HP
  - Superstar win-rate range: 45.0%–54.3%
- This keeps the established ~25-turn target and roster balance after the legality correction.

## Certification
- 155/155 automated regression tests passing.
