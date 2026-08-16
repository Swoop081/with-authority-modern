# WWE Legacy v0.12.28 — André Powerhouse Balance Pass

Supersedes v0.12.27 as the working development baseline.

## André the Giant balance target

André is deliberately restored to the upper regular-roster power band, with a target CPU win rate of roughly **55–60%** while remaining below the Season 1 Final Boss ceiling.

- **HP remains 66.** The buff comes from offensive identity and setup reliability rather than raw health inflation.
- **Giant’s Reach** now triggers on the first **3** connected Strike Moves each match. Each trigger gives André’s next Strength Move in that Control sequence **-2 Cost / +5 Damage** and André gains **+1 Adrenaline**.
- Giant’s Reach now correctly stores its damage bonus for the **next Strength Move**; an intervening Strike or other method can no longer consume it.
- **The Eighth Wonder** now begins with **+1 Strength Momentum and +2 Adrenaline**.
- **Double Underhook Suplex** is now **C5 / D14**. On connect it searches/draws **Sitdown Splash**, and André’s next Sitdown Splash that Control sequence costs **3 less**.
- **Sitdown Splash** is now **C11 / D18**. Its printed Cost follows the v0.12.27 elite-damage rule: 18 Damage sits above the normal 17-Damage Finisher tier and therefore carries a real Cost premium.

## Balance verification

Focused André-vs-roster simulations, alternating player sides:

- Seed set A: **56.68%** over 1,960 matches
- Seed set B: **55.77%** over 1,960 matches
- Seed set C: **57.76%** over 1,960 matches
- Combined: **3,336–2,544 (56.73%)** over **5,880 matches**, with **0 stalls**.

Additional release verification:

- **24,500-match deep roster simulation:** 0 stalls; André **547–433 (55.8%)** over 980 matches.
- **4,900-match final roster benchmark:** 0 stalls; André **116–80 (59.2%)**.
- Final benchmark average match length: **20.78 turns**.
- **150/150 automated tests pass.**
- Validation, card-ID, flow and counter-state audits report **0 issues**.
- Counter-chain audit: **0 non-Punch/Elbow cards** reached counter depth 2+.

The existing Punch ↔ Elbow counter-exchange rules and all v0.12.27 elite-damage pricing remain intact.
