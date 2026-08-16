# v0.12.35 Counter Terminality Audit

The iPhone playtest exposed an illegal `Arm Drag → Arm Drag Counter → Arm Drag Counter` sequence. The canonical rule is now enforced at two layers:

1. `counterEligibility()` rejects replies to an offensive counter-attack unless its exchange key is exactly `punch-elbow`.
2. `MatchEngine.counter()` refuses any non-Punch/Elbow reply to a counter-attack and only opens a counter reply window when the counter card's exchange key is exactly `punch-elbow`.

This keeps the intended Punch/Elbow wrestling exchange while making positional/offensive reversals such as Arm Drag Counter, Jawbreaker, Hurricanrana, Hip Toss and similar counter-attacks terminal.

The browser module graph is also stamped end-to-end with the release cache key so iPhone Safari cannot execute stale nested counter logic.

## Certification
- Automated tests: 170/170 passed.
- Validation: 50 Superstars / 50 decks / 432 gameplay cards / 0 orphans / 0 issues.
- Flow audit: 0 issues.
- Card-ID audit: 0 issues.
- Counter-state audit: 0 issues.
- Counter-chain audit: 2,450 matches / 0 stalls / 745 depth-2+ counter-attacks / 0 non-Punch/Elbow depth-2+ cards.
- Standard balance simulation: 2,450 matches / 0 stalls / 25.67 average turns / 2,008 pins / 442 submissions.
