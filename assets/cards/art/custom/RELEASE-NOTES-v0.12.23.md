# WWE Legacy v0.12.23 — Unlimited Match Clock + HP Pass

## Starting HP
- Every authored Superstar receives **+10 starting HP**.
- Match state uses the new value for both starting HP and maximum HP.

## Match clock
- The 50-turn match limit is removed.
- Matches no longer end in a draw because a turn threshold was reached.
- The in-match clock remains visible as **TURN N** for pacing/history only.
- Match progression modes no longer award or message a draw result.

## Fight Forever
- Remains a 4-star RAW booster-only Action.
- **Playable only after Turn 10** (Turn 11 onward).
- Restores **10 HP to both Superstars**, capped at each Superstar’s starting/max HP.
- No longer modifies any turn limit because turn limits no longer exist.

## Certification
Fresh working-tree certification:
- **137/137 tests passed**.
- Flow audit: **50 Superstars / 0 issues**.
- Validation: **50 decks / 432 gameplay cards / 0 orphans / 0 issues**.
- Collector ID audit: **482/482 IDs clean**.
- Counter-state audit: **314 Moves categorized / 0 issues**.
- Ordered balance: **2,450 matches / 0 stalls / 21.11 average turns**.
- Extended balance: **4,900 matches / 0 stalls / 21.18 average turns / 0 draws**.
- Finish mix across the extended run: **4,193 pins / 707 submissions**.
- Dead-turn audit: **1.99 passes per match; 1/2,450 matches reached a four-pass streak; max streak 4**.
