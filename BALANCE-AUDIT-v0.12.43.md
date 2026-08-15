# WWE Legacy v0.12.43 — Roster Balance Audit

## Scope

This pass rebalances all 50 authored Superstars after the retained-Control draw model, actual-HP pin table, terminal counter exchange rules, and persistent current-HP submission system were settled. No core match-flow rule is changed in v0.12.43.

Target hierarchy:
- regular roster: approximately 40–60% CPU-vs-CPU win rate, with most as close to the middle as identity allows;
- André the Giant: 55–60%;
- The Rock and Goldberg: deliberate prestige tier above the normal field.

## Final deep certification

- Matches: **24,500**
- Stalls: **0**
- Average / median turns: **25.36 / 25**
- P1 win rate: **48.29%**
- Pin / submission finishes: **92.0% / 8.0%**
- Winner HP: **31.8% average / 29.0% median**
- Loser HP: **9.6% average**

The prestige tier remains separated at Goldberg **73.7%** and The Rock **73.3%**. The highest normal-roster result is André at **59.0%**; excluding the two prestige Superstars, the full regular range is **39.9%–59.0%**.

## Identity-focused tuning

| Superstar | Final HP | Primary balance note |
|---|---:|---|
| The Rock | 70 | Prestige tier remains intentionally above regular roster. |
| Goldberg | 68 | Prestige tier; Streak/sequence identity retained. |
| André the Giant | 66 | Re-anchored to requested 55–60% band without changing Sitdown Splash pricing. |
| Mankind | 68 | Deranged Resilience 3× at 7+ damage / reduce 3; Mr. Socko correctly adds +2 Mandible Claw pressure. |
| CM Punk | 63 | Pipe Bomb first 3 Counters; Anaconda Vise draws 1 on connect. |
| Paige | 64 | Anti-Diva first 3 qualifying Strikes; PTO P5. |
| Charlotte Flair | 65 | Genetically Superior capped at 1; Figure-Eight P6. |
| Ultimate Warrior | 67 | Feel the Power first 2 qualifying sequences, draw 1 + 1 Adrenaline. |
| Rhea Ripley | 63 | Prism Trap P5. |
| Brock Lesnar | 67 | Kimura Lock P6. |
| Logan Paul | 61 | Viral Athlete one Strike→Agility draw; Knockout Punch C9/D8; Paulverizer C11/D13. |
| Chad Gable | 61 | Olympic Pedigree sequence draw twice; Ankle Lock P6. |
| Danhausen | 66 | Curse first 3 Control losses; Knee-vil tutors Triple D at -3 Cost. |
| Gunther | 65 | Gojira Clutch P6. |
| Bron Breakker | 65 | Steiner Recliner P6. |

Additional HP-only corrections were used where they were sufficient, rather than rewriting working abilities. These include Randy Savage 59, Stephanie Vaquer 66, Kevin Owens 62, Undertaker 65, Oba Femi 62, Becky Lynch 64, Raquel Rodriguez 59, Rey Mysterio 60, Damian Priest 61, Randy Orton 63, Jacob Fatu 62, Solo Sikoa 61 and Jade Cargill 62.

## Final roster table

| Rank | Superstar | HP | Record | Win rate | Submission wins |
|---:|---|---:|---:|---:|---:|
| 1 | Goldberg | 68 | 722-258 | 73.7% | 0 |
| 2 | The Rock | 70 | 718-262 | 73.3% | 0 |
| 3 | André the Giant | 66 | 578-402 | 59.0% | 6 |
| 4 | Oba Femi | 62 | 566-414 | 57.8% | 0 |
| 5 | Kevin Owens | 62 | 558-422 | 56.9% | 0 |
| 6 | Jade Cargill | 62 | 549-431 | 56.0% | 0 |
| 7 | Solo Sikoa | 61 | 546-434 | 55.7% | 0 |
| 8 | Bayley | 67 | 536-444 | 54.7% | 133 |
| 9 | Jey Uso | 68 | 531-449 | 54.2% | 0 |
| 10 | Randy Savage | 59 | 529-451 | 54.0% | 0 |
| 11 | Roman Reigns | 63 | 529-451 | 54.0% | 0 |
| 12 | Randy Orton | 63 | 529-451 | 54.0% | 0 |
| 13 | Raquel Rodriguez | 59 | 523-457 | 53.4% | 0 |
| 14 | Hulk Hogan | 68 | 518-462 | 52.9% | 0 |
| 15 | Sol Ruca | 58 | 516-464 | 52.7% | 65 |
| 16 | Finn Bálor | 66 | 514-466 | 52.4% | 0 |
| 17 | Drew McIntyre | 65 | 511-469 | 52.1% | 0 |
| 18 | Chelsea Green | 59 | 509-471 | 51.9% | 0 |
| 19 | The Undertaker | 65 | 507-473 | 51.7% | 0 |
| 20 | Liv Morgan | 67 | 507-473 | 51.7% | 0 |
| 21 | Sami Zayn | 63 | 506-474 | 51.6% | 0 |
| 22 | Damian Priest | 61 | 502-478 | 51.2% | 0 |
| 23 | El Grande Americano | 61 | 494-486 | 50.4% | 0 |
| 24 | Kane | 69 | 490-490 | 50.0% | 0 |
| 25 | Nia Jax | 67 | 486-494 | 49.6% | 0 |
| 26 | Paige | 64 | 480-500 | 49.0% | 165 |
| 27 | Ultimate Warrior | 67 | 470-510 | 48.0% | 0 |
| 28 | Dominik Mysterio | 59 | 467-513 | 47.7% | 0 |
| 29 | CM Punk | 63 | 462-518 | 47.1% | 196 |
| 30 | Seth Rollins | 64 | 462-518 | 47.1% | 0 |
| 31 | Stone Cold Steve Austin | 66 | 462-518 | 47.1% | 0 |
| 32 | Alexa Bliss | 65 | 459-521 | 46.8% | 0 |
| 33 | Penta | 62 | 458-522 | 46.7% | 0 |
| 34 | LA Knight | 67 | 457-523 | 46.6% | 0 |
| 35 | Jacob Fatu | 62 | 453-527 | 46.2% | 0 |
| 36 | Charlotte Flair | 65 | 451-529 | 46.0% | 229 |
| 37 | Gunther | 65 | 445-535 | 45.4% | 279 |
| 38 | Tiffany Stratton | 60 | 444-536 | 45.3% | 0 |
| 39 | Cody Rhodes | 63 | 443-537 | 45.2% | 34 |
| 40 | Chad Gable | 61 | 438-542 | 44.7% | 210 |
| 41 | IYO SKY | 58 | 434-546 | 44.3% | 0 |
| 42 | Bron Breakker | 65 | 434-546 | 44.3% | 90 |
| 43 | Stephanie Vaquer | 66 | 427-553 | 43.6% | 0 |
| 44 | Rhea Ripley | 63 | 426-554 | 43.5% | 168 |
| 45 | Brock Lesnar | 67 | 426-554 | 43.5% | 112 |
| 46 | Becky Lynch | 64 | 415-565 | 42.3% | 153 |
| 47 | Rey Mysterio | 60 | 413-567 | 42.1% | 20 |
| 48 | Logan Paul | 61 | 409-571 | 41.7% | 0 |
| 49 | Danhausen | 66 | 400-580 | 40.8% | 0 |
| 50 | Mankind | 68 | 391-589 | 39.9% | 112 |

## Interpretation

The final normal-roster distribution is intentionally not flattened to 50%. Strong identities retain an advantage, weaker/comedic or specialist identities can sit toward the lower edge, and prestige rewards remain visibly stronger. The important result is that no normal Superstar is materially outside the intended band after the new match-flow and submission systems are accounted for.
