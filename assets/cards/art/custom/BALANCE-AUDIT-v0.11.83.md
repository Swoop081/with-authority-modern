# Season 1 Final Simulation Audit — v0.11.83

Four-game alternating-side round robin across all 41 Superstars: **3,280 matches**, **0 stalls**, average **33.70 turns**.

Finish types: **2,884 pins** and **396 submissions**.

## Pin-zone telemetry

| Zone | Attempts | Successful | Sim success |
|---|---:|---:|---:|
| Green | 0 | 0 | 0.00% |
| Amber | 5 | 0 | 0.00% |
| Red | 8,744 | 2,884 | 32.98% |

CPU strategy intentionally avoids most Amber covers; engine probability tests separately enforce an Amber hard cap of 8%, so human players cannot turn Amber into a routine finish through Pin Bonus.

## Full roster

| Superstar | Win rate | Avg turns |
|---|---:|---:|
| The Rock | **81.3%** | 30.0 |
| Logan Paul | **69.4%** | 22.7 |
| Roman Reigns | **66.9%** | 31.4 |
| Charlotte Flair | **66.9%** | 29.8 |
| Raquel Rodriguez | **65.6%** | 30.0 |
| Ultimate Warrior | **60.0%** | 33.3 |
| Hulk Hogan | **58.8%** | 33.6 |
| Rey Mysterio | **58.8%** | 31.8 |
| Gunther | **57.5%** | 32.2 |
| LA Knight | **57.5%** | 33.3 |
| El Grande Americano | **56.3%** | 33.2 |
| André the Giant | **55.0%** | 35.5 |
| The Undertaker | **54.4%** | 35.8 |
| Damian Priest | **53.8%** | 33.9 |
| Randy Savage | **52.5%** | 34.5 |
| Penta | **52.5%** | 32.8 |
| Brock Lesnar | **51.9%** | 33.4 |
| Cody Rhodes | **51.3%** | 32.5 |
| Chad Gable | **51.3%** | 32.6 |
| IYO SKY | **50.6%** | 32.4 |
| Sol Ruca | **50.6%** | 31.2 |
| Dominik Mysterio | **50.6%** | 32.1 |
| Becky Lynch | **47.5%** | 34.0 |
| Alexa Bliss | **47.5%** | 33.6 |
| Bayley | **45.0%** | 33.4 |
| CM Punk | **45.0%** | 32.7 |
| Paige | **44.4%** | 34.4 |
| Kevin Owens | **44.4%** | 35.2 |
| Finn Bálor | **43.1%** | 36.5 |
| Oba Femi | **42.5%** | 38.0 |
| Rhea Ripley | **41.9%** | 34.8 |
| Stone Cold Steve Austin | **40.0%** | 35.4 |
| Seth Rollins | **39.4%** | 32.4 |
| Liv Morgan | **39.4%** | 36.8 |
| Jey Uso | **39.4%** | 35.1 |
| Danhausen | **38.8%** | 32.2 |
| Stephanie Vaquer | **38.1%** | 35.3 |
| Chelsea Green | **38.1%** | 45.5 |
| Kane | **34.4%** | 36.6 |
| Tiffany Stratton | **34.4%** | 34.4 |
| Mankind | **33.8%** | 37.6 |

## Lead-design read

- The Rock remains the deliberate prestige reward and clear Season 1 ceiling.
- Roman, Charlotte and Raquel sit at the top edge of the regular roster rather than in Final Boss territory.
- Logan remains the highest non-prestige simulation outlier and is intentionally trimmed in this build; his result remains the first balance watch for any post-v1 telemetry.
- The broad middle now contains most of the roster, while the remaining low end is much less catastrophic than earlier passes.
- The new late-pin model increases match length by design: winning covers are concentrated in Red health instead of ending matches early in Amber.
