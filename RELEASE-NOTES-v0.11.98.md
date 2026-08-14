# WWE Legacy v0.11.98 — Flair Chop + Shared Move Expansion

## Added cards

- **SVS1-031 — Shoulder Block** — 1★ Common shared Move, C3 / D4 / Strength 1; grounds the opponent.
- **SVS1-032 — Shining Wizard** — 2★ Uncommon shared Move, C5 / D8 / Strike 2; grounded opponent only; deals +1 Head body-part damage on connect.
- **SVS1-033 — Double Underhook Facebuster** — 2★ Uncommon shared Move, C5 / D8 / Technical 1 + Strength 1; grounds the opponent.
- **RAW1-034 — Steel Chair to the Back** — 2★ Uncommon shared Move, C4 / D7 / Strike 1; grounded opponent only; deals +1 Back body-part damage on connect. The body-part damage is a one-shot impact, not a maintainable hold.
- **WC1-034 — Spanish Fly** — 3★ Rare shared Move, C6 / D10 / Agility 2 + Strength 1; grounds the opponent.
- **SD1-034 — 2nd Rope Leg Drop** — 2★ Uncommon shared Move, C5 / D8 / Agility 1; grounded opponent only.
- **EVO1-061 — Flair Chop** — 3★ Rare **Flair Family Trademark**, C3 / D6 / Strike 1; currently family-gated to Charlotte Flair; deals +1 Chest body-part damage on connect.

## Charlotte Flair update

- The original generic **Chop** remains unchanged as a regular shared Move.
- Charlotte Flair's four recommended-deck copies of generic Chop are replaced by four copies of **Flair Chop**; her deck remains 55 pages with 12 Momentum.
- Charlotte's Lead Off now uses Flair Chop in the slot previously occupied by generic Chop.
- **Wooo!** now reads: *Once per match after Charlotte connects with Flair Chop, draw 1 page and gain +2 Adrenaline.*
- The Wooo! trigger is implemented in the live engine and consumes the Special once it fires.

## Pool / authenticity policy

- Shoulder Block, Shining Wizard, Double Underhook Facebuster, Steel Chair to the Back, Spanish Fly and 2nd Rope Leg Drop are live booster/Deck Builder cards but remain **booster-only for recommended-deck auditing** until an authentic user is explicitly assigned.
- No unrelated Superstar deck was changed just to create usage for the new shared Moves.

## Validation

- 62/62 automated tests pass.
- Card Art Studio data regenerated from the canonical manifest.
- Full rebuild validation, flow audit, card-ID audit and deterministic balance simulation completed for this build.

### Balance simulation

- 2,070 deterministic matches
- 0 stalls
- 36.7 average turns
- 1,663 pin finishes
- 289 submission finishes
- 118 turn-limit draws
