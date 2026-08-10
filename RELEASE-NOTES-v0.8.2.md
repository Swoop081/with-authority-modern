# WWE Legacy: Collectible Card Game — v0.8.2

## Counter-chain correction

The Counter phase now uses the card game's Move Type relationships as an actual exchange rather than treating every counter card as a disposable reversal.

- A pure defensive Counter (Dodge, Duck, Technical/Veteran Reversal, Scramble Free, Counter Any specials) stops the incoming Move and transfers Control as before.
- A damaging/offensive Move that legally Counters the incoming Move becomes the new proposed Move.
- The original attacker receives a full legal Counter window against that counter-attack.
- Counter chains can continue recursively for as long as legal cards exist.
- If the final offensive counter-attack is not answered, its printed damage, posture, submission and on-connect effects resolve normally.
- The rule is data-driven and automatically covers the full collectible pool, not a hand-maintained exception list.

Regression coverage includes the reported sequence where European Uppercut must deal damage when used as a Counter and Rhea Ripley must be offered a legal counter-to-counter response window.

## Match pacing target

The finishing model was recalibrated after counter chains were enabled. Printed Move damage was not globally reduced.

Targets:
- approximately 25 turns per normal match
- losing Superstar near 10% HP at the finish
- Turn 50 remains a hard safety ceiling

Final 6,912-match AI-vs-AI audit:
- Average turns: 24.43
- Average winner HP: 17.48
- Average loser HP: 3.68 (about 8.7% of the roster's 42.4 average max HP)
- Stalls: 0
- Time-limit draws: 89 / 6,912 (1.3%)
- Pins: 5,831
- Submissions: 992

## Verification

- 127/127 engine tests pass.
- Full 24-Superstar matchup simulation completed without stalls.
- Generic regression iterates over every collectible offensive Move with a Counter relationship and confirms that it opens the appropriate response window.
- Flow and economy audits were rerun; no unrelated collection/economy changes were introduced.

## Follow-up balance note

The pacing/counter foundation is stable, but individual Superstar win-rate spread remains wider than the eventual competitive target. That should be handled as a separate roster/deck tuning pass rather than by weakening the corrected Counter or match-flow rules.
