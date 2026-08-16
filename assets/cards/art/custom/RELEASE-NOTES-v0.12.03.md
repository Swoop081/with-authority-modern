# WWE Legacy: Collectible Card Game — v0.12.03
## Premium Card Frame + Rarity Presentation Pass

This release redesigns the Card Art Studio front presentation while preserving every set's existing artwork background and top-right show logo placement.

### Card frame
- Every set now uses a stronger outer frame in that set's primary presentation colour.
- A restrained inner metallic/highlight line keeps the frame readable without replacing the set background.
- Existing set background art and top-right logos are unchanged.

### Rarity stars
- Card Art Studio data now carries each card's canonical rarity.
- 1★ Common, 2★ Uncommon, 3★ Rare and 4★ Very Rare cards render the matching number of gold stars.
- Stars run vertically down the inside of the upper-left border.

### Professional lower information panel
- Replaced the previous floating name / COST / DAM text with a structured dark glass-metal trading-card panel.
- The card name sits on a dedicated set-accented nameplate.
- Move cards use separate framed COST and DAMAGE tiles, a centred method-requirement line, and a MOVE/type identifier.
- Other card types use a clean type identifier.
- Every front now includes a small collector-code footer and WWE Legacy brand line.

### Data / regression protection
- Card Art Studio generated data now includes `rarity` and `moveType`.
- Added regression coverage for set-coloured borders, 1–4 gold rarity stars and the structured lower panel.
- No card backgrounds, set logos, gameplay values, decks, collector numbering or booster pools changed.

### Validation
- 67/67 tests pass.
- 46 Superstars / 46 decks.
- 406 gameplay cards / 452 collector-manifest cards.
- 0 orphans / 0 validation issues.
- Card-ID and flow audits clean.
