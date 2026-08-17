# WWE Legacy v0.12.89 — Build Certification

- Regression tests: **367/367 pass**
- Validation: **50 Superstars / 50 decks / 438 gameplay cards / 0 orphans / 0 issues**
- Flow audit: **50 Superstars / 0 issues**
- Card-ID audit: **488/488 / 0 issues**
- Counter-state audit: **438 gameplay cards / 318 Moves / 0 issues**
- Economy smoke audit: **60 packs / 300 cards / 0 duplicate Entrance pulls / 0 foil-first failures**
- Known art backlog remains unchanged from the previous certified baseline.

## v0.12.89 — Amber/Red Pin Gate Hotfix

- Pin attempts are now legal only when the defending Superstar is in **Amber or Red health**.
- Green-health pin attempts are rejected at both the shared rules layer (`canAttemptPin`) and the match-engine boundary (`MatchEngine.attemptPin`).
- Player controls, CPU decision-making and direct engine calls therefore obey the same legality rule.
- The existing actual-HP pin chance table is unchanged: 0–4 HP remains 75%, 5 HP 70%, 6 HP 60%, 7 HP 55%, 8 HP 50%, 9 HP 48%, 10 HP 45%, 11 HP 40%, 12 HP 35%, 13 HP 30%, 14 HP 25%, 15 HP 20%, and 16+ HP 5%.
- The 5% 16+ HP chance can only be rolled once the defender's percentage-health band is Amber/Red, closing the Green-health early-cover loophole that allowed implausible Turn 3 wins.
- No card data, Superstar HP, damage, deck composition, booster odds, progression, rewards, career records or achievements changed.

The package retains all certified v0.12.89 functionality and uses the clean packaging rules introduced in v0.12.69.
