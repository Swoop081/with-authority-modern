# WWE Legacy v0.12.27 — Elite Damage + Punch/Elbow Exchange Pass

This build applies the locked high-damage Cost premium and broadens the deliberate fundamental strike exchange without reopening positional Counter loops.

## Elite damage Cost tier
- **17 Damage remains the ceiling of the normal Finisher tier.**
- Any Move above 17 printed Damage must pay a real printed Cost premium over comparable 17-Damage Finishers.
- **People’s Elbow** — **C11 / D18** (was C10 / D18).
- **Jackhammer** — **C12 / D19** (was C11 / D19).
- André the Giant’s **Sitdown Splash** remains **C9 / D16** because it is below the elite >17 Damage tier.
- Existing move-specific discounts still function normally, but the printed starting Cost now reflects the elite damage tier.

## Punch ↔ Elbow Counter exchange
- **Punch and Elbow now share one deliberate strike-exchange family.**
- A Punch counter-attack may be answered by either another Punch **or an Elbow**.
- An Elbow counter-attack may be answered by either another Elbow **or a Punch**.
- Both cards retain their normal Arm Extended Counter coverage on the first Counter window.
- Auto Counter remains illegal against counter-attacks.
- All non-exchange offensive counters remain terminal by default, so Jawbreaker, Hurricanrana, Arm Drag Counter, Hip Toss and similar positional reversals still cannot recurse.

## Card text
- Punch now states that another Punch or Elbow may Counter it when used as a Counter.
- Elbow now states that another Elbow or Punch may Counter it when used as a Counter.

## Regression coverage
- Added direct coverage for the C11/D18 and C12/D19 elite-damage ladder.
- Added direct and engine-level Punch ↔ Elbow exchange tests in both directions.
- Existing terminal positional-Counter and Auto Counter protections remain covered.

## Certification
- **148/148 automated tests pass.**
- Validation: **50 Superstars / 50 valid 60-page decks / 432 gameplay cards / 482 collector IDs / 0 issues**.
- Counter-state audit: all eight physical states and all four Submission body areas remain covered; 0 issues.
- Ordered 2,450-match balance: **0 stalls / 20.74 average turns / 2,121 pins / 329 submissions**.
- 4,900-match final balance: **0 stalls / 20.88 average turns**. Rock remains the intended Season 1 prestige outlier at **77.0%** and Goldberg the Season 2 prestige outlier at **75.0%** in this deterministic batch.
- Counter-chain audit: **5,644** offensive counter-attacks, **823** at depth 2+, **0 non-exchange cards** at depth 2+, maximum depth **4**. Every depth-2+ reply is Punch or Elbow.
- Dead-turn audit remains healthy at **1.56 Action passes/match**, **0/2,450** matches with a 4+ consecutive-pass streak, maximum pass streak **3**.
