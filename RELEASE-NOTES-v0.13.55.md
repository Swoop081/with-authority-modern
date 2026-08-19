# WWE Legacy v0.13.55 — Foil Power Chase Pass

v0.13.55 restores Foils as a meaningful gameplay chase while preserving the card-plate workflow introduced by the layered front system.

## Foil gameplay
- A **Foil Move with positive Damage gets +1 Damage**.
- Zero-Damage Moves and non-Move cards do not gain Damage from Foil treatment.
- The live card plate/rules face displays the Foil-adjusted Damage, so artwork files do not need to be re-exported when the gameplay stat changes.
- The runtime modifier is idempotent and cannot stack by passing through multiple render/materialization layers.

## Ownership and deck limits
- Standard five-copy cards now track finish caps independently: **up to 5 Normal + 5 Foil owned**.
- Pulling a Foil no longer consumes/replaces one of the five Normal ownership slots.
- Deck construction still allows **at most 5 total copies of a card identity**, regardless of finish. Owning 5 Normal + 5 Foil does not permit a 10-copy deck package.
- Unique Superstar/Entrance/Manager ownership and Momentum ownership retain their existing caps.

## Deck Lab and recommendations
- AUTO BUILD, manual additions, blueprint restoration and Deck Assistance prefer owned Foil copies first.
- A Foil recommendation for a positive-Damage Move is now presented as a real **Foil Upgrade**, with the +1 Damage benefit stated explicitly.
- Saved Foil copies materialize into matches with the adjusted live Damage stat.
- Finish-specific ownership is validated so a saved deck cannot claim more Foil copies than the Collection actually owns.

## Booster economy
- Standard-card overflow is now finish-specific: a Normal pull converts only after the Normal 5-copy cap is full; a Foil pull converts only after the Foil 5-copy cap is full.
- Duplicate UP values and booster collation are otherwise unchanged.

All v0.13.54 iPhone Screenshot Consolidation work and earlier locked gameplay/UI behavior remain intact unless explicitly superseded above.
