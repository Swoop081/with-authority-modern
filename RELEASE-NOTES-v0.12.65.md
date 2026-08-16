# WWE Legacy CCG v0.12.65 — Season Pace + Booster Reward + HP Identity Pass

## Scope
This pass combines the approved progression/economy tuning with the current pack-opening presentation fixes, foil readability, hand-card inspection consistency, and a complete 50-Superstar HP identity rebalance. Existing match rules, deck sizes, counter rules, pin curve, persistent submission rules, Momentum rules, Entrance rules, Final Boss reward road, and current card effects remain unchanged except where explicitly listed below.

## Season XP pacing
- Tier size remains 100 XP and the Season Road remains 50 tiers.
- Match win: 25 -> **15 XP**.
- Match loss: 5 -> **3 XP**.
- Daily challenge: 50 -> **25 XP**.
- Weekly challenge: 200 -> **100 XP**.

## Booster rarity system
- Normal booster slots now roll rarity first, then select uniformly from legal cards in that rarity bucket.
- Rarity weights are now literal slot odds when all rarity buckets are available:
  - Common 50%
  - Uncommon 30%
  - Rare 15%
  - Very Rare 5%
- Superstar cards are removed from the normal rarity roll and use a separate pack-level chase.
- Superstar chase chance: **5% per booster**.
- Superstar cards are 4-star Very Rare, always Foil, max 1 owned, and leave that set's chase pool once owned.
- Superstar pity is tracked independently per set and now guarantees an unowned Superstar on **pack 50** after 49 misses.
- Pulling a Superstar resets that set's pity counter.
- Selected/played Superstar has no influence on rarity pools or card selection. A Roman Reigns profile can pull non-Roman Rare/Very Rare SummerSlam cards normally.

## Pack opening presentation
- Once the wrapper is ripped, all five pack cards are face up. Browsing to the next card never returns to a generic face-down card back.
- A compact face-up five-card strip remains visible during the focused-card review.
- Excess-copy conversion is now a reward sequence: duplicate card disintegrates inward, converts into a full **+UP** reward tile, and that tile replaces the duplicate card in the pack results.
- Universe Points are credited at the conversion moment and the top UP counter pulses/increments.

## Foil presentation
- Foil is now rendered as an actual card-surface material effect rather than relying on a FOIL badge.
- Added animated prismatic sheen, reflective edge treatment and stronger reveal glow.
- The effect now works on finished custom fronts, generated fronts and Superstar fronts when the displayed copy is Foil.
- Owned Foils are presented with the foil material treatment in Collection and Catalogue.

## Match card inspection
- Tapping a card in the player's hand now opens the same large modal inspection language used by Play Pile and Superstar cards.
- The inspect modal supports front/rules flip and tap-outside-to-close.
- The adjacent Play/Counter/Escape button remains the only control that commits the card, preventing accidental plays while inspecting.

## Starting HP identity rebalance
HP now primarily reflects physical size, strength and durability. André is the unique ceiling; elite powerhouses follow; Cody/Seth/Punk-style builds form the middle; Rey/IYO-style high-flyers sit at the bottom.

| Superstar | HP |
|---|---:|
| André the Giant | 72 |
| Brock Lesnar | 70 |
| Oba Femi | 70 |
| Goldberg | 69 |
| Hulk Hogan | 69 |
| Kane | 69 |
| Nia Jax | 69 |
| Bron Breakker | 68 |
| Drew McIntyre | 68 |
| Gunther | 68 |
| Jacob Fatu | 68 |
| The Undertaker | 68 |
| Ultimate Warrior | 68 |
| Jade Cargill | 67 |
| Mankind | 67 |
| Raquel Rodriguez | 67 |
| Roman Reigns | 67 |
| The Rock | 67 |
| Damian Priest | 66 |
| Kevin Owens | 66 |
| Rhea Ripley | 66 |
| Solo Sikoa | 66 |
| Stone Cold Steve Austin | 66 |
| Charlotte Flair | 65 |
| Penta | 65 |
| Randy Orton | 65 |
| Becky Lynch | 64 |
| Chad Gable | 64 |
| CM Punk | 64 |
| Cody Rhodes | 64 |
| El Grande Americano | 64 |
| Finn Bálor | 64 |
| Jey Uso | 64 |
| LA Knight | 64 |
| Randy Savage | 64 |
| Sami Zayn | 64 |
| Seth Rollins | 64 |
| Bayley | 63 |
| Paige | 63 |
| Stephanie Vaquer | 63 |
| Alexa Bliss | 62 |
| Liv Morgan | 62 |
| Logan Paul | 62 |
| Tiffany Stratton | 62 |
| Chelsea Green | 61 |
| Danhausen | 61 |
| Dominik Mysterio | 61 |
| Sol Ruca | 58 |
| IYO SKY | 57 |
| Rey Mysterio | 57 |

## Card-front compatibility retained
- Missing or failed non-Superstar custom fronts fall back to the canonical rules/details face rather than a blank card.
- Momentum remains the explicit exception and keeps the authored live Strength/Strike/Technical/Agility Momentum fronts.
