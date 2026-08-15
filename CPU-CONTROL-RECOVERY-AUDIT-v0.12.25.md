# WWE Legacy v0.12.25 — CPU Control Recovery Audit

## Reported issue
After a player retained Control through a long Move string and passed, the CPU too often played one Momentum page and immediately passed Control back instead of launching offense.

## Root cause
Two separate problems were contributing:
1. CPU Momentum selection was greedy: it could play the first legal Momentum instead of the Momentum that best opened the current hand.
2. Several 60-page recommended decks had enough response-only reversal density and mid/high-cost duplication that the CPU could regain Control with no immediately usable offense.

## Final correction
- CPU simulates each playable Momentum and chooses the page that opens the strongest legal offense; when none opens immediately, it chooses the Momentum that best reduces the Method/Cost deficit toward the closest offensive Move.
- Enabling Actions are considered before committing to a dead Momentum line.
- CPU never deliberately passes while a legal offensive Move is already available.
- The rejected blanket defensive-reversal trim was removed because it distorted roster balance.
- Final recommended decks preserve defensive identity while using targeted low-cost curve swaps and selected high-cost duplicate reductions.
- All 50 recommended decks remain 60 pages with 12 Momentum, full eight-state counter coverage and all four Submission response areas.
- Every recommended deck contains at least 8 quick offensive pages (Cost 1–3, at most one Method Momentum required). Defensive-only reversal density is at most 9 pages.

## Direct v0.12.24 → v0.12.25 CPU comparison
Same deterministic 2,450-match diagnostic:

| Metric | v0.12.24 | v0.12.25 | Change |
|---|---:|---:|---:|
| Control starts with no legal Move | 14.3% | 11.7% | -18.2% |
| Bad Momentum choices when another Momentum opened offense | 118 | 0 | eliminated |
| CPU passes | 5,114 | 3,984 | -22.1% |
| Momentum → immediate pass | 0.95 / match | 0.73 / match | -23.2% |
| Pass while a legal offensive Move already exists | 0 | 0 | unchanged |

## Exact long-sequence regression scenario
A dedicated diagnostic watches the new controller immediately after the opponent voluntarily ends a Control sequence containing 5+ connected Moves.

| Metric | v0.12.24 | v0.12.25 |
|---|---:|---:|
| Observed recovery cases | 279 | 314 |
| CPU launched a Move | 260 | 304 |
| CPU passed before launching offense | 19 | 10 |
| Pass rate | 6.81% | 3.18% |
| Momentum → pass rate | 5.73% | 3.18% |

That is a **53% reduction** in the exact failure pattern reported during phone testing.

## Dead-turn audit
2,450 matches:
- 1.66 Action passes per match
- 0 matches with a 4+ consecutive-pass streak
- maximum consecutive-pass streak: 3

## Balance guard
The first aggressive reversal trim was rejected before packaging because it pushed several roster win rates too far. The final branch uses a balance-safe deck curve instead.

12,250-match deep run (245 matches per Superstar):
- 0 stalls / 0 draws
- 20.99 average turns; median 21; P95 32; max 47
- 85.6% pin finishes / 14.4% submission finishes
- 43 of 50 Superstars finish inside 40–60% win rate
- 47 of 50 are inside 35–65%
- deliberate prestige/upper-tier leaders remain The Rock (73.3%), Goldberg (68.8%), Solo Sikoa (65.3%), Oba Femi (61.0%), Jade Cargill (60.8%) and Roman Reigns (60.4%)
- lowest result is André the Giant at 39.2%; the rest of the roster is 40%+

Counter/Auto Counter systems remain healthy in that run:
- 243,649 Counter windows
- 22.6% manual Move reversals
- 6.8% Auto Counters
- 70.5% passes
- 0 CPU Auto Counter playable-card preservation violations
- Auto Counter cost distribution: 5 = 14,935 uses; 6 = 1,717; 7 = 6

## Verification
- 142/142 automated tests pass
- 50 Superstars / 50 valid 60-page recommended decks
- 432 gameplay cards
- 482/482 collector IDs clean
- 0 orphans
- 0 validation or flow issues
- counter-state audit clean
