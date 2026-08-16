# WWE Legacy v0.12.21 — Auto Counter Restoration

## Auto Counter returns

Auto Counter has been restored as a distinct fallback response alongside the eight-state matching Move-counter system. It is not a replacement for Move reversals.

- First Auto Counter use by a Superstar in a match: **ditch 5 pages**.
- Second use: **ditch 6 pages**.
- Third use: **ditch 7 pages**.
- Each later use increases the cost by 1.
- The option is legal only if the full cost can be paid while leaving **at least 2 pages in hand immediately after payment**.
- Auto Counter use count resets at the start of every match.
- A successful Auto Counter discards the incoming Move, transfers Control to the defender and advances the global turn normally.

## Human selection flow

When Auto Counter is available in a Counter window, the player can choose **AUTO COUNTER · DITCH N**. The hand enters selection mode and the player taps the exact pages they want to ditch. Selected cards are visibly raised/highlighted. The Auto Counter resolves only after exactly the required number of pages are selected and the player confirms; Cancel returns to the normal matching-Counter/pass window.

## CPU policy

The CPU always prefers a legal matching Move reversal when one exists. If it has no matching Move counter, it may spend Auto Counter only when the incoming non-Finisher is:

- a mid-level Move (Cost 4–6),
- a high-level Move (Cost 7+),
- a Trademark,
- a Move whose printed damage would reduce the CPU to 0 HP, or
- a low-cost Submission that would immediately cause a tap because that body area has already been worked and the incoming pressure reaches the submission threshold.

The two-page remainder rule is always enforced for the CPU as well.

## Finisher protection

**Finishers cannot be Auto Countered under any circumstance.** A Finisher can only be stopped by a legal Move reversal that matches its assigned physical counter state.

## Preserved systems

- v0.12.20 Leapfrog remains Agility 1 and reverses Running Aerial.
- The eight physical counter states and four Submission body-area response layers remain intact.
- 60-page recommended decks / 12 Momentum baseline remains intact.
- Full-art Move Cost/Damage readability and flame Momentum cards remain intact.

## Certification

- 131/131 automated tests pass before final cache stamping.
- Flow audit: 50 Superstars, 0 flow issues.
- Ordered balance: 2,450 matches, 0 stalls, 19.09 average turns.
- Extended balance: 4,900 matches, 0 stalls, 19.12 average turns.
- Dead-turn audit: 2.31 passes/match; 3/2,450 matches reached a four-pass streak; maximum streak 4.

The restored Auto Counter interaction still requires final on-device visual/touch verification.
