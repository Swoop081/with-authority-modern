# WWE Legacy v0.12.97 — Build Certification

- Regression tests: **386/386 pass**
- Validation: **50 Superstars / 50 decks / 438 gameplay cards / 0 orphans / 0 issues**
- Flow audit: **50 Superstars / 0 issues**
- Card-ID audit: **488/488 / 0 issues**
- Counter-state audit: **438 gameplay cards / 318 Moves / 0 issues**
- Economy smoke audit: **60 packs / 300 cards / 0 duplicate Entrance pulls / 0 foil-first failures**

- Live Events hub: **Daily + 3 Day + Weekly concurrent towers**, plus 24-hour birthday events when active
- Store Superstar price: **2,500 UP**
- Art audit: **488 collector cards / 451 unfinished custom fronts** (known presentation backlog; fallback presentation remains active)

## v0.12.97 — Multi-Tower Live Events + Store Economy Pass

- Normal and Foil copies now use identical runtime gameplay values. Foil is presentation / collector treatment only; it does not alter Damage, Cost, requirements or effects.
- Deck Assistance no longer ranks Normal → Foil as a gameplay upgrade or presents `+1 Damage` Foil language. Recommended-build restoration remains functional and fully validated.

- Deck Assistance now prefers owned Foil finishes when it places or cosmetically updates a card in a saved deck; this changes presentation only.
- Excess Normal copies convert for **10 UP** while excess Foil copies convert for **20 UP** after the card's ownership cap is reached.
- My Legacy now exposes a dedicated **Rules & How to Play** route. The Rulebook covers the current match system, resources, card timing, Move legality, Counter States, Auto Counter, health zones, exact pin table, Submissions, Deck Lab legality, rarity and Foils, boosters, duplicates, Deck Assistance, all current game modes, Season 1, Challenges, records, achievements and local-save behavior.
- The Rulebook is integrated into My Legacy navigation and uses a quick category menu plus expandable rule sections.
- No card IDs, authored card stats, Superstar HP, booster odds, Season reward placements, career records or achievement requirements changed.

The package retains all certified v0.12.91 functionality and prior gameplay / presentation locks unless explicitly superseded above.
