# WWE Legacy: Collectible Card Game — v0.11.96

Current canonical development baseline: **v0.11.96 — Shared Move + Action Expansion Batch**.

This build adds **Fight Forever (RAW1-030)** as a **4★ Very Rare, booster-only Action**. It restores 10 HP to both Superstars (up to starting HP) and extends the live match turn limit by 10. Matches now carry an explicit default **50-turn limit**, with Fight Forever changing a normal 50-turn match to 60 when played. The command bar displays the live turn count/limit.

RAW Series 1 and Money in the Bank Series 1 were tied as the smallest Season 1 subset pools before the addition; RAW was used as the tie-breaker. Fight Forever is intentionally excluded from all recommended decks and unlock packages while remaining obtainable from RAW boosters.

The canonical health bands remain **Green = 65–100% HP, Amber = 25–64% HP, Red = 0–24% HP**, and Pin Bonus remains retired.

Season 1 currently contains **42 playable Superstars** across SummerSlam, Hall of Fame, Evolution, RAW, Worlds Collide, Money in the Bank, SmackDown and the Season 1 Final Boss reward package.

Run `npm test`, `npm run validate`, `npm run card-ids`, and `npm run flow` for release validation. The art audit intentionally reports missing final artwork while placeholder production is in progress.
