# WWE Legacy CCG v0.12.51 — Card Front Requirement Cleanup

## Scope
Presentation-only Card Art Studio/export update. No gameplay, roster, AI, pin, submission, deck, card balance, economy, or menu behavior changes.

## Move-card front change
- Moves with a real Method Momentum requirement continue to print the requirement in the center of the lower identity plate (for example `◆ 3 STRENGTH`).
- Moves with no Method Momentum requirement now print **no requirement placeholder at all**.
- Removed the Card Art Studio fallback text `NO METHOD REQUIREMENT` / `NO MOMENTUM REQUIRED` from exported Move fronts.
- On no-requirement Moves, `MOVE • <TYPE>` shifts upward and becomes slightly larger so the empty center space is used cleanly.
- Cost and Damage remain the large unboxed lower-left / lower-right figures established in v0.12.37.

## Example
`F-5` remains C10 / D17 / Finisher / Grapple with no Method requirement in gameplay. Its finished card front now shows the Move name, Cost 10, Damage 17, and `MOVE • GRAPPLE` only — no redundant requirement sentence.

## Certification
- 234/234 automated tests pass.
- Validation: 50 Superstars / 50 decks / 432 gameplay cards / 0 orphans / 0 issues.
- Collector ID audit: 482 cards / 482 manifest entries / 0 issues.
- Flow audit: 50 Superstars / 0 issues.
