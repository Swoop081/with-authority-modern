# WWE Legacy v0.12.29 — Roster Balance + Match Pacing Pass

## Release summary

v0.12.29 is a full-roster balance and match-pacing pass built from v0.12.28. It addresses the roster-wide win-rate spread, overly early pin finishes, Logan Paul's burst pacing, Gunther's missing Finisher designation, underused setup/payoff lines, Evolution underperformance, André's post-pin-curve re-anchor, and rare empty-deck pass deadlocks.

## Global gameplay changes

- Health-only pin odds were tightened: Green remains unpinnable, Amber is only 0–1%, and Red scales from 5% to a 45% maximum at 0 HP.
- This moves the deep-roster average to 24.82 turns (median 24) while keeping 0 simulation stalls.
- Finishes in the 24,500-match deep benchmark: 81.5% pin, 18.5% submission, 0.012% exhaustion decision.
- Repeated empty-deck pass deadlocks now end by referee decision after eight consecutive passes, using relative remaining HP; only 3 of 24,500 deep matches required it.
- Submission Finishers that exceeded Pressure 5 were normalized to Pressure 5 so the tougher pin curve does not create a dominant submission-only meta.

## AI / sequence play

- CPU Move selection now uses sequence-aware Move scoring across the whole roster instead of a limited Superstar whitelist.
- Search/tutor setup Moves, named discounts, grounded payoffs and Special-trigger setup cards receive generic sequence value.
- Specific routing was strengthened for signature chains including Liv, Rhea, Stephanie Vaquer, IYO SKY, Alexa Bliss, Finn Bálor, Kevin Owens, Penta, Drew McIntyre, Raquel Rodriguez, Cody Rhodes, Randy Savage, Sami Zayn, Seth Rollins, Kane and LA Knight.
- Bayley's previous connected Method is now remembered across Control sequences, matching The Role Model's printed intent.

## Notable card / Superstar corrections

- Gunther — Gojira Clutch is now a true Finisher at C9 / D4 / Submission Pressure 5; Folding Powerbomb continues to route into it.
- Logan Paul — Viral Athlete is reduced to its first-Strike Strength Momentum payoff; Knockout Punch is C10 / D7 and Paulverizer C12 / D12. His deep average match length is now 19.27 turns rather than the ~13.6-turn pre-pass outlier.
- André the Giant — HP 71, Eighth Wonder +3 starting Adrenaline, Giant's Reach +6 Damage to the reserved next Strength Move. Sitdown Splash remains C11 / D18 and Double Underhook Suplex remains C5 / D14.
- Liv Morgan — Jersey Codebreaker now searches Oblivion with a 3-Cost discount.
- Rhea Ripley — Prism Trap searches Riptide with a 2-Cost discount.
- Stephanie Vaquer — Devil's Kiss grounds the opponent and searches Vaquer Inferno with a 3-Cost discount.
- Cody Rhodes — Cody Cutter searches Cross Rhodes with a 3-Cost discount.
- Kevin Owens — Pop-Up Powerbomb searches Stunner with a 4-Cost discount.
- Randy Savage — Double Axe Handle routes to Flying Elbow Drop with a 3-Cost discount and Adrenaline payoff.
- Finn Bálor — Shotgun Dropkick routes to Coup de Grâce with a 3-Cost discount; 1916 also routes to Coup de Grâce.
- Sami Zayn — Exploder Suplex Into Turnbuckle searches Helluva Kick with a 4-Cost discount; Never Say Die now triggers at 40% HP.
- Seth Rollins — Buckle Bomb routes to Curb Stomp with a 4-Cost discount.
- Randy Orton — Apex Predator discounts by 2 and Outta Nowhere gives RKO a 5-Cost Counter discount.
- Hogan's Big Boot now routes to Atomic Leg Drop with a 4-Cost discount.

## Deep balance benchmark — 24,500 matches

- Average turns: 24.82
- Median turns: 24
- Winner HP remaining: 36.9% average / 29.2% median
- P1 win rate: 52.27%
- Stalls: 0
- André the Giant: 55.5%
- The Rock: 69.6%
- Goldberg: 63.5%

The regular-roster spread is materially tighter than v0.12.28. The former non-prestige 63–65% leaders are now at 59.8% or below, and the former sub-40% floor has been eliminated in this benchmark. The Rock and Goldberg remain deliberate prestige outliers.

## Verification

- 156 / 156 automated tests passing.
- Validation: 50 Superstars, 50 decks, 432 gameplay cards, 0 orphans, 0 issues.
- Card ID audit: 0 issues.
- Flow audit: 0 issues.
- Counter-state audit: 0 issues.
- Counter-chain audit: 0 non-exchange cards at depth 2+; deep exchanges remain Punch/Elbow only.
- Balance simulation: 2,450 matches, 0 stalls, 25.06 average turns.
- Card Art Studio regenerated from the v0.12.29 gameplay data: 482 collectible entries / 50 Superstars.
