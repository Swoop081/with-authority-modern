# WWE Legacy v0.12.32 — Entrance Control Timing + Possession Audit

v0.12.32 supersedes v0.12.31 as the working baseline.

## Gameplay correction

Entrance effects now resolve in two stages:

- Entrance Method Momentum resolves before the bell exactly as before.
- Entrance Adrenaline resolves exactly once, the first time that Superstar gains Control.
- P1 receives the Adrenaline portion with opening Control at the bell.
- P2 receives the Adrenaline portion on P2's first actual Control gain.

This prevents P2's Entrance Adrenaline from being reduced by P1's connected-Move Adrenaline drain before P2 has had any opportunity to use the Entrance benefit.

The core Adrenaline economy is unchanged: every connected Move gives the attacker **+1 Adrenaline** and the defender **-1 Adrenaline**.

## CPU / rules scope

No experimental comeback mechanics from rejected v0.12.30 are restored. No pin curve, Submission threshold, HP, Move, deck, Counter, Auto Counter cost, or roster-stat changes are made in this release.

The accepted v0.12.31 CPU decision logic is retained byte-for-byte. Multiple additional passive-AI experiments were tested during this audit and rejected because they did not improve the full-match result safely.

## Possession audit conclusion

The audit shows that the remaining lopsidedness is strongly associated with permanent Method Momentum gained during uninterrupted Control. By P2's first Control, P1 averages a **+2.37 Method Momentum** lead. After a two-Move P1 opening sequence, P2's first Control is a zero-Move pass **31.3%** of the time.

A dedicated zero-Move audit found no case where simply choosing a different single Momentum page on that possession would have opened offense. This means the main remaining issue is not a trivial CPU Momentum-choice bug.

## Certification

- Automated tests: **162/162 passing**
- 24,500 deep matches: **0 stalls**
- Average / median turns: **24.73 / 24**
- P1 win rate: **51.89%**
- Winner HP: **35.9% average / 27.1% median**
- Loser HP: **12.8% average**
- Pin / Submission finishes: **81.6% / 18.4%**
- Validation: **0 issues**
- Card-ID audit: **0 issues**
- Flow audit: **0 issues**
- Counter-state audit: **0 issues**
- Counter-chain audit: **0 non-Punch/Elbow cards at depth 2+**

See `POSSESSION-AUDIT-v0.12.32.md` for the diagnostic detail.
