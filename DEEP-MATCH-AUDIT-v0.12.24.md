# WWE Legacy v0.12.24 — Deep Match Balance Audit

- **24,500 matches** across two independent full-roster batches (12,250 each).
- Every Superstar plays **980 matches** in the combined sample.
- CPU vs CPU using v0.12.24 recommended 60-page decks and live rules.

## Global pacing

- Average turns: **~21.34**; median 21; P95 33; longest sampled match **54 turns**.
- **0 stalls, 0 draws**; 3 matches ran beyond Turn 50 and all ended normally.
- Finishes: **20,752 pins (84.7%)** and **3,748 submissions (15.3%)**.
- First-Control win rate: **52.87%**.
- Winners finish at **~50.0% HP** on average; losers at **~13.6%**.

## Counter / Auto Counter

- Counter windows: **469,989**; manual Move counters **110,956 (23.6%)**; Auto Counters **34,731 (7.4%)**; passes **324,302 (69.0%)**.
- Auto Counter costs: 5 pages **30,570**, 6 pages **4,128**, 7 pages **33**.
- CPU playable-card preservation violations: **0**.

### Physical state response rates

| State | Windows | Manual | Auto | Total stopped | Finisher counter |
|---|---:|---:|---:|---:|---:|
| Arm Extended | 121,550 | 34.7% | 2.1% | 36.8% | 25.4% |
| Front Control | 75,773 | 21.3% | 7.6% | 28.9% | 21.6% |
| Leg Extended | 73,922 | 20.1% | 7.2% | 27.3% | 28.1% |
| Torso Trapped | 70,921 | 15.3% | 8.9% | 24.2% | 20.1% |
| Body Elevated | 64,162 | 19.9% | 10.2% | 30.1% | 20.7% |
| Diving Aerial | 36,042 | 20.2% | 12.4% | 32.6% | 18.9% |
| Rear Control | 14,306 | 23.4% | 14.1% | 37.5% | 32.4% |
| Running Aerial | 13,313 | 26.8% | 13.3% | 40.1% | 19.7% |

The targeted deck swaps improved the previously weakest state access without adding another global reversal mapping: Body Elevated, Diving Aerial, Front Control and Torso Trapped all move modestly upward while Running Aerial remains near its already-healthy baseline.

## Targeted balance movement

| Superstar | v0.12.23 | v0.12.24 | Change |
|---|---:|---:|---:|
| Sami Zayn | 23.1% | **39.4%** | +16.3 pts |
| Seth Rollins | 27.6% | **42.7%** | +15.1 pts |
| Gunther | 29.8% | **41.1%** | +11.3 pts |
| Paige | 29.4% | **43.8%** | +14.4 pts |
| Cody Rhodes | 39.7% | **45.8%** | +6.1 pts |
| Kane | 35.9% | **39.2%** | +3.3 pts |
| Randy Savage | 37.3% | **40.9%** | +3.6 pts |
| André the Giant | 38.8% | **39.8%** | +1.0 pts |
| Randy Orton | 39.5% | **52.8%** | +13.3 pts |
| Rey Mysterio | 66.8% | **60.9%** | -5.9 pts |

The original five priority fixes are no longer extreme bottom outliers. Rey is pulled back from 66.8% to about 61% without removing the 619 identity. Randy Orton lands inside the central band after fixing both his reversal access and invalid Lead Off reference.

## Full roster — combined 24,500-match sample

| Rank | Superstar | Win % | Counter pass % | Manual ctr/match | Auto ctr/match |
|---:|---|---:|---:|---:|---:|
| 1 | The Rock | 73.4% | 61.8% | 2.52 | 0.64 |
| 2 | Goldberg | 66.2% | 68.8% | 2.05 | 0.52 |
| 3 | Roman Reigns | 63.5% | 64.7% | 2.53 | 0.61 |
| 4 | Solo Sikoa | 62.6% | 65.4% | 2.45 | 0.59 |
| 5 | Rey Mysterio | 60.9% | 69.2% | 2.14 | 0.62 |
| 6 | Jade Cargill | 60.4% | 69.8% | 1.86 | 0.61 |
| 7 | Oba Femi | 60.0% | 65.2% | 2.86 | 0.64 |
| 8 | Chad Gable | 59.0% | 73.3% | 1.53 | 0.68 |
| 9 | CM Punk | 57.2% | 64.8% | 2.51 | 0.75 |
| 10 | Charlotte Flair | 57.2% | 67.1% | 2.20 | 0.64 |
| 11 | Logan Paul | 57.1% | 74.6% | 1.33 | 0.49 |
| 12 | Damian Priest | 56.7% | 69.3% | 2.21 | 0.62 |
| 13 | Sol Ruca | 56.5% | 74.7% | 1.25 | 0.83 |
| 14 | Dominik Mysterio | 56.4% | 68.8% | 2.25 | 0.67 |
| 15 | Becky Lynch | 56.1% | 63.0% | 2.70 | 0.67 |
| 16 | El Grande Americano | 55.1% | 66.5% | 2.68 | 0.85 |
| 17 | Drew McIntyre | 54.3% | 71.0% | 1.96 | 0.65 |
| 18 | Brock Lesnar | 53.0% | 67.1% | 2.66 | 0.72 |
| 19 | Ultimate Warrior | 52.9% | 67.9% | 2.34 | 0.57 |
| 20 | Randy Orton | 52.8% | 65.6% | 2.66 | 0.60 |
| 21 | LA Knight | 51.3% | 65.7% | 2.69 | 0.78 |
| 22 | Alexa Bliss | 50.7% | 68.4% | 2.35 | 0.67 |
| 23 | Jacob Fatu | 50.4% | 77.9% | 1.19 | 0.81 |
| 24 | Mankind | 49.4% | 63.5% | 3.31 | 0.51 |
| 25 | Nia Jax | 48.8% | 73.2% | 1.80 | 0.71 |
| 26 | Chelsea Green | 48.6% | 63.4% | 3.22 | 1.09 |
| 27 | Bron Breakker | 48.5% | 74.1% | 1.76 | 0.64 |
| 28 | Raquel Rodriguez | 48.0% | 76.2% | 1.37 | 0.74 |
| 29 | Bayley | 47.0% | 66.5% | 2.36 | 0.72 |
| 30 | Kevin Owens | 46.8% | 64.4% | 3.03 | 0.93 |
| 31 | Cody Rhodes | 45.8% | 75.3% | 1.55 | 0.77 |
| 32 | Stone Cold Steve Austin | 45.6% | 62.2% | 3.24 | 0.54 |
| 33 | Paige | 43.8% | 71.6% | 2.08 | 0.64 |
| 34 | Jey Uso | 43.8% | 69.9% | 2.39 | 0.82 |
| 35 | Stephanie Vaquer | 43.0% | 67.3% | 2.69 | 0.67 |
| 36 | The Undertaker | 42.8% | 65.6% | 2.93 | 0.72 |
| 37 | Seth Rollins | 42.7% | 73.5% | 1.73 | 0.84 |
| 38 | Danhausen | 42.7% | 70.4% | 2.17 | 0.78 |
| 39 | Rhea Ripley | 42.1% | 66.8% | 2.80 | 0.54 |
| 40 | Penta | 42.0% | 71.6% | 2.20 | 0.77 |
| 41 | Finn Bálor | 41.9% | 71.3% | 1.91 | 0.95 |
| 42 | Hulk Hogan | 41.2% | 69.1% | 2.48 | 0.56 |
| 43 | Liv Morgan | 41.1% | 67.6% | 2.61 | 0.79 |
| 44 | Gunther | 41.1% | 74.3% | 1.83 | 0.79 |
| 45 | Randy Savage | 40.9% | 67.1% | 2.69 | 0.76 |
| 46 | Tiffany Stratton | 40.4% | 77.5% | 1.17 | 0.90 |
| 47 | IYO SKY | 39.9% | 73.9% | 1.63 | 0.83 |
| 48 | André the Giant | 39.8% | 71.1% | 2.35 | 0.79 |
| 49 | Sami Zayn | 39.4% | 69.4% | 2.40 | 0.70 |
| 50 | Kane | 39.2% | 68.7% | 2.59 | 0.69 |

## Distribution / remaining watch items

- **16/50** are in the tight 45–55% band; **40/50** are in 40–60%.
- The Rock and Goldberg remain deliberate prestige outliers. Roman and Oba remain upper-tier by design.
- The lowest current cluster is around 39–41%, rather than the 23–30% floor seen in v0.12.23.
- Torso Trapped remains the least frequently stopped physical state, but it is no longer a reason to add counters globally; current deck-specific coverage is the safer lever.
- Back-target submissions remain rare in the authored move pool; this is a content-distribution issue, not a submission-engine failure.
- Winner HP still averages around 50%. That is a separate comeback/close-match question and was deliberately not changed in this targeted pass.
- The art audit remains open because most authored/future card fronts have not yet received final user-supplied artwork.
