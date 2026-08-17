# WWE Legacy v0.12.70 — Season Pack + Tornado DDT Pass

## Daily Login Booster regression repair
- Restores the Daily Login Booster to a single full-width purple stateful row.
- The Daily Login Booster status and Claim/Next-Free state are contained inside the same control rather than floating as separate text.
- Ready claims still launch the standard booster-opening sequence immediately and return to Season after completion.
- Corrects the stale Season caption to Daily 25 XP / Weekly 100 XP; reward logic was already 25/100.

## Pack reveal regression repair
- Removes the five-card thumbnail strip from the live one-card-at-a-time reveal screen.
- The active card remains the sole large reveal card with progress dots, rarity/foil/new flags and tap-to-advance guidance.
- Pack contents remain pre-revealed internally, so advancing to the next card does not return to a face-down card back.
- The complete five-card composition remains on the Pack Complete summary screen.

## Tornado DDT
- Adds shared move **Tornado DDT — SS1-141** to SummerSlam Series 1.
- Cost 5 / Damage 8 / Agility 2 / Grapple / Uncommon / Front Control.
- On connect: Grounds opponent and deals +1 persistent Head damage.
- Installs the user-supplied action photograph as authored raw card art.
- Added to the 60-page recommended decks for Cody Rhodes, Seth Rollins and CM Punk, replacing redundant pages rather than increasing deck size.
- Card Art Studio data and the canonical collector manifest include the new card.

## Packaging
- Retains the v0.12.69 clean allowlist package process; no historical audit/release-note clutter is reintroduced.
