# WWE Legacy v0.12.36 — Actual HP Pin Curve

v0.12.36 supersedes v0.12.35 as the current working baseline.

## Pin system

The natural pin roll is now based on **actual HP remaining**, so the HUD number directly tells the player how dangerous a cover is:

- 0–4 HP: 75%
- 5 HP: 70%
- 6 HP: 60%
- 7 HP: 55%
- 8 HP: 50%
- 9 HP: 48%
- 10 HP: 45%
- 11 HP: 40%
- 12 HP: 35%
- 13 HP: 30%
- 14 HP: 25%
- 15 HP: 20%
- 16+ HP: 5%

A post-Move cover can now be attempted at any HP, allowing an authentic 5% flash-pin chance early in the match. CPU normal pin timing remains conservative: absent a ready Finisher, it begins ordinary covers at 15 HP or less rather than repeatedly giving away Control on 5% attempts.

## Preserved from v0.12.35

- Offensive counter-attacks are terminal by default.
- Punch/Elbow is the only recursive counter exchange.
- Jawbreaker cannot mirror-counter Jawbreaker.
- Arm Drag Counter cannot be re-countered by another Arm Drag Counter.
- Safari/browser nested JavaScript imports remain fully version-stamped.
- Retained-Control draw remains defender-only.
- Connected-Move Adrenaline remains +1 attacker / -1 defender.
- Entrance Adrenaline still triggers once on first actual Control.
- No roster/card/deck balance values were changed.

## Validation

173/173 automated tests pass. All structural audits are clean. Standard 2,450-match simulation: 0 stalls, 23.69 average turns. Deep 24,500-match simulation: 0 stalls, 23.62 average turns / 24 median, 83.4% pins / 16.6% submissions, P1 48.1%.
