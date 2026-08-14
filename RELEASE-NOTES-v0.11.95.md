# WWE Legacy v0.11.95 — Fight Forever Booster Action + Match Turn Limit

Supersedes v0.11.94 as the current development baseline.

## Fight Forever — RAW1-030
- Added **Fight Forever** as a **4★ Very Rare Action**.
- Explicitly marked **booster-only**: it is not inserted into any Superstar recommended deck or unlock package.
- RAW Series 1 and Money in the Bank Series 1 were tied as the smallest Season 1 subset pools at 29 total cards / 25 booster-eligible cards before this addition; RAW was used as the tie-breaker.
- RAW Series 1 now contains 30 cards / 26 booster-eligible cards.
- Rules: **Restore 10 HP to both Superstars, up to their starting HP. Increase this match’s turn limit by 10.**

## Match turn limit
- Matches now carry an explicit live **turn limit**, defaulting to **50 turns**.
- If Turn 50 completes with no winner, the match ends in a draw by **turn limit**.
- Fight Forever increases the current live limit by 10, so a normal 50-turn match becomes a 60-turn match when it resolves.
- The command bar now displays **TURN X / LIMIT** so an extension is visible immediately.
- The Match Log records both HP restored and the old/new turn limit.

## Booster-only validation
- Intentional `boosterOnly` cards are exempt from the orphan-deck audit while remaining part of the active Collection, Catalogue, booster pool and canonical card-number manifest.

## Validation
- **51/51 tests pass.**
- **42 Superstars / 42 recommended decks.**
- **362 gameplay cards / 404 collector-manifest cards.**
- **0 unintended orphans / 0 validation issues.**
- 3,444-match deterministic simulation: **0 stalls**, **37.0 average turns**, **2,656 pin finishes**, **516 submission finishes**, **272 turn-limit draws**.
