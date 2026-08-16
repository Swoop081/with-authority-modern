# WWE Legacy v0.12.26 — Counter Exchange Logic Pass

This build removes unrealistic recursive counter-attack chains while preserving deliberate wrestling-style strike exchanges.

## Counter-attack chain rule
- A normal incoming Move still opens the standard Counter window and may be reversed by any legal matching Move counter.
- When an offensive reversal becomes a counter-attack, that counter-attack is **terminal by default**: it connects immediately rather than opening another generic Counter window.
- This stops sequences such as Jawbreaker → Jawbreaker, Hurricanrana → Hurricanrana, Arm Drag Counter → Arm Drag Counter, Hip Toss → Hip Toss and similar positional reversals that do not make physical sense as endless exchanges.
- Auto Counter is not legal against a counter-attack.

## Deliberate Counter Exchanges
Two fundamental strike cards are explicit exceptions:
- **Punch ↔ Punch** may continue back and forth while each Superstar has another legal Punch.
- **Elbow ↔ Elbow** may continue back and forth while each Superstar has another legal Elbow.
- Punch cannot continue an Elbow exchange and Elbow cannot continue a Punch exchange.
- These exchanges remain finite in practice because every reply consumes another card from hand.

## Card text
- Punch and Elbow now explicitly state that another copy of the same exchange Move may Counter them when they are used as a Counter.

## Same-seed chain audit versus v0.12.25
Across 2,450 ordered CPU-vs-CPU matches:
- Total offensive counter-attacks: **6,090 → 5,613**.
- Counter-attacks at depth 2 or deeper: **1,485 → 787**.
- Matches containing a depth-2+ exchange: **1,082 → 711**.
- Maximum counter depth: **5 → 3** in the deterministic ordered audit.
- Non-exchange cards appearing at depth 2+: **532 → 0**.
- v0.12.25 depth-2+ offenders included Jawbreaker (379), Arm Drag Counter (82), Arm Drag (53), Hurricanrana (10) and others. In v0.12.26 every depth-2+ event in the same audit is Punch; Elbow remains legally exchange-capable when the hand/deck situation produces it.

## Match-flow / balance guard
- 2,450-match ordered balance: **0 stalls**, 20.74 average turns.
- Dead-turn audit: **1.56 Action passes/match**, 0/2,450 matches with a 4+ consecutive-pass streak, maximum pass streak 3.
- Two independent 12,250-match deep batches (24,500 total): **0 stalls / 0 draws / 20.86 average turns**, approximately 86.2% pin / 13.8% submission finishes.
- Combined roster spread remains acceptable for the current intended hierarchy: 42/50 Superstars in 40–60%, 47/50 in 35–65%, with Rock/Goldberg and the intended upper tier remaining deliberate outliers.

## Certification
- 147/147 automated tests pass before packaging.
- 50 Superstars / 50 valid 60-page decks / 432 gameplay cards / 482 collector IDs.
- Counter-state, collector-ID, flow and validation audits: 0 issues.
