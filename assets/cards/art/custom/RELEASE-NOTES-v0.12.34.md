# WWE Legacy: Collectible Card Game — v0.12.34
## Pin Finish + Jawbreaker Hotfix

v0.12.34 supersedes v0.12.33. It is a deliberately narrow correction based on the Roman Reigns vs Oba Femi iPhone turn-by-turn test.

## Locked changes

### 0 HP natural pin chance = 75%
- Exactly **0 HP** now carries a **75% natural pin success chance**.
- This leaves a **25% natural kickout chance** for rare dramatic survival.
- **Positive-HP pin odds are unchanged from v0.12.33.** The established health-only curve remains in place at every HP value above zero.
- Reference chances on a 100 HP scale: 24 HP = 5%, 20 HP = 12%, 15 HP = 20%, 10 HP = 28%, 5 HP = 37%, 1 HP = 43%, 0 HP = 75%.
- 0 HP still does **not** cause an automatic knockout; the opponent must still complete a pin or submission. Pin Escape / Shoulder Up effects continue to work normally.

### Jawbreaker cannot counter Jawbreaker
- A normal incoming **Jawbreaker may not be answered by another Jawbreaker**.
- Jawbreaker remains a legal reversal against its other intended front/rear-control states.
- Offensive counter-attacks remain terminal by default.
- **Punch/Elbow remains the only deliberate recursive counter exchange family.**
- Auto Counter remains illegal against counter-attacks.

## Explicitly unchanged from v0.12.33
- Successful Move retains Control.
- Retained-Control turn: **defender draws 1; attacker does not receive an automatic replacement draw**.
- One Method Momentum may be played each fresh turn.
- Connected Move Adrenaline remains **attacker +1 / defender -1**.
- Entrance Momentum resolves pre-match.
- Entrance Adrenaline resolves once on first actual Control.
- No Superstar HP, decks, printed card stats, signature routes, submission thresholds, Auto Counter costs, or AI policy were retuned in this hotfix.

## Certification
- Automated tests: **168/168 passed**.
- Validation: 50 Superstars / 50 decks / 432 gameplay cards / 0 orphans / 0 issues.
- Counter-chain audit: 0 non-Punch/Elbow cards at counter depth 2+.
- Standard balance simulation: 2,450 matches / 0 stalls / ~25.7 average turns.
- Deep certification: 24,500 matches / 0 stalls / 25.58 average turns / 26 median.
- Deep finish split: 81.5% pin / 18.5% submission.
- Deep P1 win rate: 48.77%.
- Winner HP: 29.7% average / 24.6% median.
- Compared with v0.12.33, the 0-HP rule substantially reduces prolonged survival after reaching zero while preserving all positive-HP pin odds.

## Balance follow-up
The stronger 0-HP finish condition changes archetype results slightly. No individual wrestler was retuned in this hotfix; any resulting roster outliers should be handled in a separate balance pass rather than hidden inside this rules correction.
