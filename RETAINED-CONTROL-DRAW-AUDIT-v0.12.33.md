# v0.12.33 Retained-Control Draw Audit

## Question
Why were matches still lopsided even after the Entrance-Adrenaline timing bug and CPU decision fixes were corrected?

## Finding
The main amplifier was the retained-Control draw loop, not the one-Momentum-per-turn rule.

Under v0.12.32, after a connected Move the attacker:
1. retained Control;
2. began another full turn and could lay another Method Momentum;
3. drew a replacement page for the Move just spent;
4. gained +1 Adrenaline while the defender lost 1.

The defender also drew, which prevented the old defender-starvation problem, but could not turn Momentum pages in hand into permanent thresholds until finally gaining Control. This let the controller replenish offense while increasing permanent playability.

## Controlled experiments
- One Momentum per entire Control sequence: made winner HP worse by increasing Method-locked hands.
- Two Momentum per Control sequence: little meaningful improvement.
- Attacker-only retained-Control draw: substantially more lopsided.
- No retained-Control draw: much longer matches and excessive first-player disadvantage.
- Defender-only retained-Control draw: strongest healthy result; the attacker must spend hand resources to sustain offense while the defender still replenishes defensive options.

## Adopted rule
After a successful non-Submission Move retains Control:
- defender draws 1;
- attacker draws 0;
- attacker receives the normal new-turn Momentum allowance (one Momentum maximum);
- Control remains with attacker;
- successful-Move Adrenaline remains attacker +1 / defender -1.

All normal Control-transfer turns retain the pre-existing global draw behavior.

## Deep benchmark comparison
| Metric | v0.12.32 | v0.12.33 |
|---|---:|---:|
| Matches | 24,500 | 24,500 |
| Stalls | 0 | 0 |
| Average turns | 24.73 | **26.97** |
| Median turns | 24 | **27** |
| Winner HP average | 35.9% | **26.4%** |
| Winner HP median | 27.1% | **22.0%** |
| Loser HP average | 12.8% | **13.1%** |
| P1 win rate | 51.89% | **48.99%** |
| Pin finishes | 81.6% | **80.3%** |
| Submission finishes | 18.4% | **19.7%** |

The key improvement is that the median winner is now at 22% HP rather than 27.1%, while average winner HP falls by 9.5 percentage points. This occurs through natural hand expenditure and defensive replenishment, not comeback discounts, healing, pin manipulation or altered Adrenaline flow.
