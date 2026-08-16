# v0.12.34 — Pin + Counter Audit

## Pin curve
The final implementation changes **only exactly 0 HP**. All positive-HP chances remain the v0.12.33 values.

| HP % | Natural pin chance |
|---:|---:|
| 24% | 5% |
| 20% | 12% |
| 15% | 20% |
| 10% | 28% |
| 5% | 37% |
| 1% | 43% |
| **0%** | **75%** |

This avoids the rejected implementation where the entire Red zone was linearly steepened merely to reach the new endpoint.

## Jawbreaker legality
`canCounter()` now has an explicit mirror restriction: incoming `jawbreaker` + counter `jawbreaker` is illegal. This applies at the first normal Counter window as well as any later state.

The broader counter architecture is unchanged:
- normal incoming Moves open their normal Counter window;
- offensive reversals resolve as terminal counter-attacks by default;
- Punch and Elbow alone carry `counterExchangeKey: punch-elbow`;
- Auto Counter cannot answer counter-attacks.

The counter-chain audit completed 2,450 matches with **0 stalls** and **0 non-Punch/Elbow depth-2+ counter-attacks**.

## Deep match comparison
| Metric | v0.12.33 | v0.12.34 |
|---|---:|---:|
| Matches | 24,500 | 24,500 |
| Stalls | 0 | 0 |
| Avg turns | 26.97 | 25.58 |
| Median turns | 27 | 26 |
| Winner HP avg | 26.4% | 29.7% |
| Winner HP median | 22.0% | 24.6% |
| P1 win rate | 48.99% | 48.77% |
| Pin finishes | 80.3% | 81.5% |
| Submission finishes | 19.7% | 18.5% |
| 0-HP episodes | 17,269 | 15,348 |
| 0-HP survival turns | 83,099 | 36,254 |

The key intended result is the large reduction in time spent surviving at 0 HP, while preserving the positive-HP pin curve and v0.12.33 hand-flow system.
