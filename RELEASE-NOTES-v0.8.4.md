# WWE Legacy: Collectible Card Game — v0.8.4

## Match-flow corrections

- **Critical Exhaustion at 0 HP:** reaching 0 HP does not cause an automatic KO, but a wrestler at 0 HP cannot retain Control after completing offense. This keeps comeback wins possible without allowing long uninterrupted 0-HP runs.
- **Critical pin pressure:** pin odds rise sharply inside the 0–10% HP finishing window, especially at 0 HP. A pin or submission is still required to end the match.
- **Pass-reason telemetry:** CPU passes now record whether the blocker was no Move in hand, insufficient total Momentum, missing method Momentum, posture, location, stun, or another legality issue.
- **Submission maintenance:** the CPU never voluntarily releases a Finisher or Trademark submission while it has a page available to ditch for another squeeze. The rule is generic and not special-cased to Charlotte/Figure-Eight.
- **Ringside starter audit:** no recommended starter deck contains a ringside-only Move. Ringside-only cards remain collectible and legal in custom decks for ringside-focused/Falls Count Anywhere-style strategies.
- **Starter offense density:** surplus utility is trimmed to reduce empty-offense hands while preserving tactical counters and minimum Momentum/Action/Support packages.
- **Charlotte flow correction:** Charlotte's Momentum distribution was adjusted toward Technical consistency.

## Counter system retained

The v0.8.2/v0.8.3 offensive-counter rule remains intact: qualifying offensive Moves used as Counters become real counter-attacks, resolve printed damage/effects if unanswered, and open a counter-to-counter response window. European Uppercut and Rhea's response-window cases remain explicit regressions, with the generic collectible pool audited as well.

## Certification

- Regression tests: **257 / 257 passing**
- Full AI matrix: **6,912 matches**
- Stalls: **0**
- Average match length: **24.09 turns**
- Average loser HP at finish: **3.47 HP**
- Average winner HP: **19.03 HP**
- Time-limit draws: **112 / 6,912 (1.62%)**
- Finishes: **5,809 pins (84.0%)**, **991 submissions (14.3%)**
- Superstar seeded win-rate range: **Roman Reigns 43.1% → Seth Rollins 56.3%**
- Pass reasons across the matrix: no Move in hand 34,066; insufficient total Momentum 12,139; missing method Momentum 10,246; posture 2,573; location 532.

A representative 25-turn Cody Rhodes vs André the Giant log was generated alongside the build. It includes offensive counter-attacks, three kick-outs, two submission maintains with the discarded cards named, Critical Exhaustion events, and explicit pass reasons.
