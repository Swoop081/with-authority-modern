# WWE Legacy v0.12.36 — Actual-HP Pin Curve Audit

## Locked natural pin table

Natural pin success now reads directly from the defender's **actual HP left**. Max HP and health-zone percentage do not alter the roll.

| Actual HP left | Natural pin success |
|---:|---:|
| 0–4 | 75% |
| 5 | 70% |
| 6 | 60% |
| 7 | 55% |
| 8 | 50% |
| 9 | 48% |
| 10 | 45% |
| 11 | 40% |
| 12 | 35% |
| 13 | 30% |
| 14 | 25% |
| 15 | 20% |
| 16+ | 5% |

## Cover-window behavior

- A connected Move opens a cover window at any HP, so the 16+ HP 5% flash-pin chance is genuinely playable.
- The CPU does **not** normally sacrifice Control on the 5% flash-pin tier. With no ready Finisher, its normal cover decision begins at the 20% tier (15 actual HP or less).
- Pin Escape / Shoulder Up still breaks the pin automatically when legally used.
- 0 HP is still not an automatic knockout. A pin, submission, or explicit exhaustion decision must finish the match.

## Unchanged systems

- Retained-Control draw remains defender +1 page / attacker no automatic replacement draw.
- Connected Move Adrenaline remains attacker +1 / defender -1.
- One Momentum per fresh turn is unchanged.
- Entrance Momentum remains pre-match; Entrance Adrenaline remains first actual Control.
- Counter terminality from v0.12.35 is unchanged; Punch/Elbow remains the only recursive exchange family.
- No Superstar, deck, Move, Submission, HP, or signature-sequence tuning was made in this pass.

## Certification

- Automated tests: 173/173 passed.
- Validation: 50 Superstars / 50 decks / 432 gameplay cards / 0 orphans / 0 issues.
- Card IDs: 482 collectibles / 0 issues.
- Flow audit: 0 issues.
- Counter-state audit: 0 issues.
- Counter-chain audit: 2,450 matches / 0 stalls / 4,442 counter-attacks / 725 depth-2+ / max depth 3 / **0 non-Punch/Elbow depth-2+**.
- Standard balance simulation: 2,450 matches / 0 stalls / 23.69 average turns / 2,045 pins / 405 submissions.
- Deep simulation: 24,500 matches / 0 stalls / 23.62 average turns / 24 median / P1 48.1% / 83.4% pin / 16.6% submission.
- Deep end state: winner HP 35.4% average / 32.8% median; loser HP 15.1% average.

## Balance note

This rule intentionally makes low actual HP more finishable and shortens matches compared with v0.12.35 (about 25.7 turns in the standard run). Because the threshold is fixed actual HP rather than a percentage of Max HP, higher-HP wrestlers can gain relative value. No compensating roster changes are hidden inside v0.12.36; any roster retuning should be assessed separately after iPhone playtesting.
