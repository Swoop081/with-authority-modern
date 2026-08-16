# Season 1 Balance Audit — v0.11.82

Directional AI round robin: 3,280 matches, four games per unique matchup with alternating sides. This is a heuristic balance signal, not a replacement for human playtesting.

| Superstar | Win rate | Avg turns |
|---|---:|---:|
| The Rock | **81.2%** | 22.4 |
| Raquel Rodriguez | **80.6%** | 21.5 |
| Roman Reigns | **69.4%** | 25.3 |
| Gunther | **66.9%** | 23.7 |
| André the Giant | **61.9%** | 26.6 |
| Dominik Mysterio | **61.2%** | 25.1 |
| El Grande Americano | **60.6%** | 25.0 |
| LA Knight | **60.0%** | 25.8 |
| Finn Bálor | **60.0%** | 27.2 |
| Hulk Hogan | **58.8%** | 24.6 |
| Alexa Bliss | **58.8%** | 25.6 |
| Charlotte Flair | **58.1%** | 25.3 |
| Ultimate Warrior | **57.5%** | 26.0 |
| Penta | **56.2%** | 25.2 |
| Randy Savage | **55.0%** | 26.3 |
| Chad Gable | **55.0%** | 26.5 |
| Cody Rhodes | **53.1%** | 25.3 |
| Rey Mysterio | **51.2%** | 26.0 |
| Mankind | **49.4%** | 29.0 |
| Kevin Owens | **48.8%** | 26.5 |
| Brock Lesnar | **48.1%** | 27.2 |
| The Undertaker | **46.9%** | 27.7 |
| Paige | **46.2%** | 25.4 |
| Rhea Ripley | **45.6%** | 26.8 |
| Logan Paul | **45.6%** | 23.6 |
| IYO SKY | **45.0%** | 25.3 |
| Stone Cold Steve Austin | **44.4%** | 27.7 |
| Liv Morgan | **44.4%** | 27.8 |
| Seth Rollins | **42.5%** | 25.3 |
| Chelsea Green | **41.2%** | 35.7 |
| Jey Uso | **40.6%** | 26.6 |
| Kane | **38.8%** | 27.9 |
| Damian Priest | **38.8%** | 27.3 |
| Bayley | **38.1%** | 26.9 |
| Sol Ruca | **38.1%** | 24.8 |
| CM Punk | **37.5%** | 26.5 |
| Stephanie Vaquer | **35.6%** | 27.6 |
| Danhausen | **35.6%** | 25.1 |
| Oba Femi | **33.8%** | 30.9 |
| Tiffany Stratton | **31.2%** | 27.2 |
| Becky Lynch | **28.1%** | 28.9 |

Stalls: **0**.

### Lead-design read

- The Rock remains the intentional prestige outlier.
- Raquel remains the clearest regular-roster watch. The v0.11.82 trim to Tejana Bomb/Judgment Day Backup did not materially move the heuristic result, which strongly suggests her overall power/curve—not one isolated effect—is driving the simulation. Do not chase this further without human play data.
- Tiffany remains low in the simple AI model. Her locked Strength-to-Agility sequence is now explicitly recognised by CPU move selection, but the directional result barely moves; human playtesting remains the correct next signal.
- Chelsea and Damian retain distinct counter/control identities and remain within watch range rather than requiring immediate redesign.
- Becky/Stephanie remain likely under-valued by the simple AI because submissions and sequencing are not represented as intelligently as direct damage.
