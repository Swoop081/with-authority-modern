# v0.12.42 — Submission Card Audit

## Locked submission model

- Genuine Submission holds deal **0 printed HP damage**.
- A successful application/maintain adds persistent body-part damage only.
- Persistent body-part damage remains after release for the rest of the match.
- A tap occurs when the targeted body-part damage meets or exceeds the defender’s **current HP** while a Submission is successfully applied/maintained.
- Body-part damage above current HP does not cause a tap while no hold is active.

## Genuine holds

| Hold | C | HP Dmg | Persistent / turn | Target | Position |
|---|---:|---:|---:|---|---|
| Figure-Four Leglock | 6 | 0 | +4 | Legs | Grounded |
| Koji Clutch | 6 | 0 | +4 | Head | Grounded |
| Anaconda Vise | 7 | 0 | +5 | Head | Grounded |
| Boston Crab | 5 | 0 | +4 | Legs | Grounded |
| Gojira Clutch | 9 | 0 | +5 | Head | Any |
| Kimura Lock | 7 | 0 | +5 | Arms | Grounded |
| Mandible Claw | 9 | 0 | +5 | Head | Any |
| Bearhug | 5 | 0 | +4 | Chest | Standing |
| Prism Trap | 7 | 0 | +4 | Legs | Grounded |
| Dis-arm-her | 7 | 0 | +5 | Arms | Grounded |
| Crossface | 6 | 0 | +4 | Head | Grounded |
| Figure-Eight Leglock | 10 | 0 | +5 | Legs | Grounded |
| PTO | 7 | 0 | +4 | Arms | Grounded |
| STF | 5 | 0 | +4 | Legs | Grounded |
| Ankle Lock | 9 | 0 | +5 | Legs | Grounded |
| Octopus Hold | 5 | 0 | +4 | Arms | Standing |
| Mexican Surfboard | 5 | 0 | +4 | Back | Grounded |
| Abdominal Stretch | 4 | 0 | +3 | Chest | Standing |
| Steiner Recliner | 7 | 0 | +5 | Back | Grounded |
| Side Headlock | 3 | 0 | +3 | Head | Standing |
| Wristlock | 2 | 0 | +2 | Arms | Standing |
| Sleeper Hold | 4 | 0 | +4 | Head | Standing |
| Tongan Death Grip | 8 | 0 | +5 | Head | Standing |
| Choke on the Ropes | 3 | 0 | +3 | Head | Standing |

**Total genuine Submission holds: 24.**

## False submission tags removed

- **Blockbuster** is restored to an Aerial impact Move; it no longer creates/maintains submission damage.
- **Ultimate Warrior’s Diving Shoulder Block** is restored to an Aerial impact Move; it no longer creates/maintains submission damage.

## Target / pressure corrections

- **Bearhug:** Chest, P4, standing.
- **Abdominal Stretch:** Chest, P3, standing.
- **Octopus Hold:** Arms, **P4** (down from P5), standing.
- Grounded holds now actually require a grounded opponent; standing holds now reject a grounded opponent. This standing restriction is enforced for Submission cards only, so existing non-submission sequencing is not changed by this pass.

## CPU handling

- CPU emergency defense still treats a hold within two successful applications of a tap as an Auto Counter priority when Auto Counter is legal; at 15 HP or less, a three-application threat is also critical.
- Submission Finishers/Trademarks are no longer automatically overvalued just because they are Finishers: the CPU scores them primarily by persistent body damage already banked and applications remaining to a tap.
- When maintaining a hold, the CPU preserves Finishers, Trademarks, Specials and other high-value pages where possible.

