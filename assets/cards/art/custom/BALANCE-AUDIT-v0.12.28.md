# André Powerhouse Balance Audit — v0.12.28

Target: keep André the Giant in the **55–60%** CPU win-rate band without increasing his 66 HP or violating the >17 Damage Cost premium.

## Locked tuning

- HP: **66**
- The Eighth Wonder: **+1 Strength Momentum / +2 Adrenaline**
- Giant’s Reach: first **3** connected Strike Moves; next Strength Move this Control sequence **costs 2 less, deals +5 Damage**, André gains **+1 Adrenaline**
- Double Underhook Suplex: **C5 / D14**, searches/draws Sitdown Splash and gives the next Sitdown Splash **-3 Cost** this Control sequence
- Sitdown Splash: **C11 / D18**
- Giant’s Reach damage is method-locked in the engine and cannot be consumed by a non-Strength Move.

## Results

| Sample | André record | Win rate | Stalls |
|---|---:|---:|---:|
| Focus seed A | 1,111–849 | 56.68% | 0 |
| Focus seed B | 1,093–867 | 55.77% | 0 |
| Focus seed C | 1,132–828 | 57.76% | 0 |
| Focus combined | **3,336–2,544** | **56.73%** | **0** |
| Deep roster, 980 André matches | **547–433** | **55.8%** | **0 global stalls** |
| Final roster benchmark, 196 André matches | **116–80** | **59.2%** | **0 global stalls** |

The 24,500-match deep roster run averages **20.77 turns**. The 4,900-match final benchmark averages **20.78 turns**. The Rock remains the clear prestige leader above André.
