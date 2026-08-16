# WWE Legacy v0.12.25 — CPU Control Recovery Pass

This build fixes the long-standing CPU pattern where, after the opponent retained Control through a long Move sequence and finally passed, the CPU would too often play one Momentum page and immediately hand Control back.

## CPU turn planning
- CPU no longer takes the first legal Momentum blindly. It simulates each playable Momentum page and chooses the one that opens the strongest legal offense, or that best reduces the Method/Cost deficit toward its nearest offensive Move.
- CPU checks enabling Actions before committing to a dead Momentum line.
- CPU does not voluntarily pass when a legal offensive Move is already available.

## Recommended-deck recovery curves
- The first experimental blanket reversal trim was rejected because it distorted roster balance.
- Final recommended decks preserve wrestler-specific defensive identity while improving the recovery curve with targeted low-cost offensive/counter Moves and selected high-cost duplicate swaps.
- Every recommended deck remains 60 pages with 12 Momentum and keeps all required eight-state Counter / Submission response coverage.
- Every deck has at least 8 quick offensive pages (Cost 1–3 with at most one Method Momentum required); defensive-only reversal density is capped at 9 rather than forcing every archetype into the same defensive count.

## Balance guard
- Strong/weak outliers created by the rejected blanket trim were corrected before packaging. The final branch retains the v0.12.24 targeted roster identities rather than flattening every deck to the same reversal/offense mix.
- The Rock and Goldberg remain deliberate prestige outliers; Roman Reigns, Oba Femi and other intended upper-tier Superstars remain strong without using the rejected global offense inflation.

## Regression target
- A dedicated diagnostic now measures the exact reported scenario: after a voluntary 5+ Move Control sequence ends, whether the new controller can launch offense or immediately passes after Momentum.

## Final certification
- 142/142 automated tests pass.
- 50 Superstars / 50 valid 60-page recommended decks / 432 gameplay cards / 482 collector IDs / 0 orphans / 0 flow or validation issues.
- Direct 2,450-match CPU comparison versus v0.12.24: control starts with no legal Move 14.3% → 11.7%; CPU passes 5,114 → 3,984; Momentum→pass 0.95 → 0.73 per match; bad Momentum choices 118 → 0.
- Exact 5+ Move recovery diagnostic: pass-before-offense 6.81% → 3.18% (53% reduction).
- Dead-turn audit: 1.66 Action passes/match, 0 matches with a 4+ consecutive-pass streak, max streak 3.
- 12,250-match deep run: 0 stalls / 0 draws / 20.99 average turns / 85.6% pin / 14.4% submission. 43/50 Superstars are inside 40–60% win rate and 47/50 inside 35–65%.
