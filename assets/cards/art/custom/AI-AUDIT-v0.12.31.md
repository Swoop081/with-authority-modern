# v0.12.31 CPU Possession / Passivity Audit

## Why v0.12.30 was reverted

The v0.12.30 closeness experiment changed pin probability, trailing Auto Counter cost, kickout draw and submission resistance. Those mechanics improved final-HP closeness but introduced explicit rubber-banding and moved archetype win rates too aggressively. v0.12.31 returns to v0.12.29 rules and investigates only CPU decision quality.

## Confirmed passive / short-sighted AI faults

### Actions were being played in the wrong order
Baseline diagnostic examples across a full roster sweep:
- **Fire Up:** playable with legal offense 10,435 times and ignored in all of those states.
- **Game Plan:** ignored alongside legal offense 2,175 times.
- **Got All of It:** ignored 230 times; every observed late use was followed by a pass that cleared the temporary +2 Damage buff.
- **Open Up a Can of Whoop-Ass:** same end-of-sequence waste pattern.

v0.12.31 now sequences useful temporary/persistent Actions before the Move they are meant to support.

### Supports were routinely installed after the offense was already over
Baseline Crowd Support diagnostic:
- playable 9,755 times,
- ignored while a Move was available 8,861 times,
- all 470 observed actual plays occurred at the end of an empty sequence immediately before a pass.

v0.12.31 installs useful Supports while offense is still available.

### Submission AI was emptying its own hand on doomed holds
Baseline full-roster diagnostic:
- 611 submission starts,
- 198 (32.4%) were mathematically unable to reach a tap with the pages in hand,
- the CPU nevertheless maintained until empty,
- 96 releases were followed immediately by a pass,
- 456 clearly poor ditch choices were observed in one broader choice audit, including 87 Finishers, 131 Trademarks and 120 Specials discarded when cheaper pages existed.

v0.12.31 releases mathematically impossible holds early and preserves higher-value pages when a hold is achievable.

### Pin Escape was being burned on near-hopeless covers
Baseline diagnostic:
- 1,343 Pin Escapes used,
- average pin chance when spent: 27.2%,
- 522 (38.9%) were burned below 20% pin chance.

v0.12.31 saves the escape below 20%. The health-only pin curve itself remains untouched.

### Counter-capable Moves were being spent casually as offense
About 23.6% of baseline offensive Move declarations used cards that also supplied counter coverage. v0.12.31 conserves the final such page only when a near-equivalent non-counter attack is available; it does not force defensive play when the counter page is clearly the best attack.

## Things tested and rejected

- **More aggressive Auto Counter:** worsened lopsidedness because spending 5–7 pages on modest attacks left the new controller unable to mount offense.
- **Changing normal cover timing:** did not solve winner-HP spread and sometimes removed useful failed-pin Control swings.
- **Blanket counter-card hoarding:** distorted individual decks, especially low-flexibility kits.
- **Always using the existing “smart Momentum” scorer:** improved some first-player bias but did not materially improve closeness because its current scoring is designed primarily to open immediate offense, not to rewrite the Momentum system.
- **Early Manager deployment:** did not produce a stable roster-wide improvement and was not retained.
- **Manual counter-attack aggression:** small effect and worsened side bias in the tested candidate; not retained.

## Certified effect

Same-size 9,800-match deep runs:

| Metric | v0.12.29 | v0.12.31 |
|---|---:|---:|
| Average turns | 24.79 | 24.91 |
| Median turns | 24 | 24 |
| Winner HP average | 36.9% | **35.6%** |
| Winner HP median | 29.0% | **26.4%** |
| Loser HP average | 12.7% | 12.7% |
| P1 win rate | 52.85% | **52.29%** |
| Pin finishes | 81.4% | 81.8% |
| Submission finishes | 18.6% | 18.2% |
| Stalls | 0 | 0 |

The improvement is meaningful but not enough to explain the entire winner-HP gap. The remaining spread is therefore **not primarily caused by the CPU simply passing with legal offense**. The next investigation should focus on how Control-based Method Momentum progression amplifies a lead: the controller can continue building Method thresholds while the defender cannot. That can be audited separately without adding comeback bonuses or changing the successful-Move Adrenaline rule.
