# WWE Legacy v0.12.32 — Possession / Momentum Audit

## Entrance timing finding

v0.12.31 granted `preMatchAdrenaline` to both wrestlers before the bell. That meant P2 could lose Entrance Adrenaline to P1's normal connected-Move `+1 / -1` shift before P2 had ever gained Control.

v0.12.32 splits Entrance timing cleanly:

- Entrance **Method Momentum** is still applied before the bell and is available immediately for counters and the first offensive turn.
- Entrance **Adrenaline** is granted once, when that Superstar first gains Control.
- P1 receives its grant with opening Control at the bell.
- P2 receives its grant only when P2 first gains Control.
- The normal connected-Move Adrenaline rule is unchanged: attacker +1, defender -1.

Measured over the possession audit, P2's first-Control Entrance Adrenaline rises from about **0.34 in v0.12.31** to **1.07 in v0.12.32**, meaning the old timing exposed roughly two-thirds of P2's average Entrance grant before it could be used.

## 9,800-match possession audit

- Stalls: **0**
- P1 win rate: **52.17%**
- P2 first-Control starting Adrenaline: **1.07 average**
- Winner Control sequences: **1.47 Moves / 10.04 damage average**
- Loser Control sequences: **1.24 Moves / 7.67 damage average**
- Winner zero-Move Control sequences: **28.3%**
- Loser zero-Move Control sequences: **40.1%**
- Winner longest Control sequence accounts for **53.3%** of the winner's connected-Move damage on average.
- When the CPU passes while still holding offensive Moves, **69.5%** of those passes include at least one Move blocked by a missing Method Momentum threshold.

## Zero-Move possession diagnostic

A dedicated 2,450-match audit examined every Control sequence that ended in a zero-Move pass.

- Zero-Move passes sampled: **1,456**
- In **0** of those cases was there a different single Momentum page that could have made an offensive Move legal on that possession.
- Therefore the dominant zero-Move problem is **not** the CPU simply choosing the wrong one-turn Momentum card.

This rules out the simplest passive-AI explanation.

## Control / Momentum feedback loop

The strongest remaining signal is permanent Method progression during uninterrupted Control.

Across 9,800 matches:

- P1 opening Control sequence: **1.79 connected Moves average**.
- By P2's first Control, P1 leads P2 by **2.37 Method Momentum on average**.
- P2's first Control is a zero-Move sequence **22.7%** of the time overall.
- If P1 connects with **0** opening Moves, P2 zero-Move rate is **14.6%**.
- If P1 connects with **1** opening Move, P2 zero-Move rate is **16.1%**.
- If P1 connects with **2** opening Moves, P2 zero-Move rate jumps to **31.3%**.
- If P1 connects with **3** opening Moves, P2 zero-Move rate is **27.0%**.

The controller can play one permanent Method Momentum on each new turn created by successful offense. The defender draws pages during those turns but cannot play Method Momentum until Control changes. That creates an early Method-threshold gap which can make the recovering hand unplayable even when it contains offensive Moves.

## AI experiments rejected

The following AI-only experiments were tested and **not retained** because they did not safely improve match closeness:

- Always using the existing Momentum planner when a Move is already legal.
- A deeper follow-up Momentum scoring heuristic.
- Broad long-sequence Auto Counter use.
- Long-sequence Auto Counter only with a large surplus hand.
- Stronger preservation of unplayed Momentum pages during Auto Counter / Submission ditching.
- Blanket aggressive Auto Counter use from the earlier v0.12.31 investigation.

The long-sequence Auto Counter experiments were especially counterproductive: they reduced some long chains but left the defender too depleted to use the gained Control, increasing winner HP and/or first-player bias.

## Smaller AI findings

- Manual Counter choice offers multiple legal reversals in only about **3.3%** of Counter windows, so first-legal reversal selection is not large enough to explain the overall lopsidedness.
- About **12.5%** of Method-blocked passes occurred after the same wrestler had previously discarded a Momentum page of a Method it later needed. This is a real optimization opportunity, but preserving those pages did not materially change the full-match closeness metrics in same-seed testing.

## 24,500-match release certification

- Stalls: **0**
- Average turns: **24.73**
- Median turns: **24**
- P1 win rate: **51.89%**
- Winner HP: **35.9% average / 27.1% median**
- Loser HP: **12.8% average**
- Finishes: **81.6% pin / 18.4% submission**
- No decision finishes in this run.

The Entrance timing fix improves fairness but does **not** solve the remaining winner-HP gap by itself. The next material design question is the interaction between permanent Method Momentum and uninterrupted Control, not another broad CPU rubber-band rule.
