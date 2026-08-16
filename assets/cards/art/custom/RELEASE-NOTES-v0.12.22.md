# WWE Legacy v0.12.22 — CPU Auto Counter Hand Preservation

## CPU Auto Counter discard intelligence

The CPU now treats the two-page Auto Counter remainder as a **playability requirement**, not merely a hand-size requirement.

- Before committing to Auto Counter, the CPU evaluates its current hand as the upcoming controller in a fresh ACTION window.
- It protects cards that would actually be legal to play in that state: offensive Moves, Momentum, Actions, Supports, Managers and immediately usable Specials.
- The CPU chooses its Auto Counter ditch pages around those protected cards.
- After paying the current Auto Counter cost, at least **two currently playable pages must remain before the normal global-turn draw**.
- If the CPU cannot pay the required 5/6/7/... pages and still preserve two playable pages, it refuses Auto Counter and passes instead.
- This is stricter than the human rule: the player still controls their own discard choices, subject to the existing minimum two-page remainder.

## Preserved Auto Counter rules

- First use costs 5 pages, then 6, 7, 8, etc.
- CPU still prefers a legal matching Move reversal first.
- CPU Auto Counter remains limited to Cost 4+ Moves, Trademarks, lethal non-Finisher Moves, or immediately tapping Submissions.
- Finishers can never be Auto Countered and require a matching Move reversal.

## Certification

- 133/133 automated tests pass.
- 50 Superstars / 50 valid 60-page decks / 432 gameplay cards / 482 collector IDs.
- 0 orphans / 0 validation issues / 0 flow issues.
- Counter-state audit clean: 314 Moves / 32 reversal-capable cards.
- Ordered balance: 2,450 matches / 0 stalls / 18.38 average turns.
- Extended balance: 4,900 matches / 0 stalls / 18.36 average turns.
- Dead-turn audit: 1.73 passes per match; 1/2,450 matches reached a four-pass streak; maximum streak 4.
