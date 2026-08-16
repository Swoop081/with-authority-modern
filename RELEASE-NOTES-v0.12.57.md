# WWE Legacy v0.12.57 — Mobile Presentation + Flow Pass

v0.12.57 supersedes v0.12.56 as the current working baseline.

This release packages the latest screenshot-driven iPhone UI pass and two presentation-flow refinements. Core match rules, balance, roster data, decks, card values, Entrance economy and Final Boss reward progression remain unchanged from v0.12.56.

### Launch + Home
- Final Boss launch promo keeps The Rock filling the full left side while tightening the right-side fade/bleed and moving the copy closer to him.
- Top-right **PACKS** and **UP** labels are reduced slightly from the previous enlargement so `PACKS` fits cleanly without clipping.
- Home wrestler renders are positioned slightly lower so heads/hair are not unnecessarily cropped.

### Season
- Daily Login Booster panel is reduced to one concise status line plus the one-line **Claim Free Booster** CTA.
- Claiming the free Daily Login Booster now launches the standard sealed-pack/rip/reveal flow immediately instead of parking the pack in Open Packs. Completing the reveal returns directly to Season.
- The Final Boss Season hero positions The Rock farther to the right to clear the title/copy area.
- **Season Command Center** is rebuilt for mobile readability: Current Tier, Season XP and Universe Points are large stacked rows, with Next Drop kept as a separate full-width row.

### Store
- Daily Store hero title scaling is reduced for clean iPhone fit.
- Featured Booster is restructured into dedicated pack-art and copy/price/CTA areas so the physical pack no longer collides with surrounding text.
- Featured Superstar shelf cards now separate collectible art, identity copy and purchase CTA into their own rows, preventing image/text overlap.

### Catalogue + Play
- Finished card fronts no longer receive duplicate live Cost/Damage overlays when those values are already printed into the card artwork. Cost/Damage remain available on the card rules back.
- Exhibition/Play Superstar selection now presents the actual collectible Superstar card front rather than a wrestler cutout inside an empty selector frame.

### Pre-Match presentation
- **Tonight’s Main Event** is restaged as a minimal WWE television matchup graphic: much larger active-show logo, strong broadcast headline, two Superstar cards, central `VS`, subtle YOU/CPU labels and one Start Match CTA. No unnecessary stats or deck information are added.
- Superstar cards now hold for roughly **1.75 seconds** before the Entrance card transition, giving each wrestler reveal time to register.

### Momentum card redesign
- Retires the flame/fire visual concept completely.
- New live Momentum fronts use a clean arena-energy visual family with strong method-colour fields, angular light geometry, a simple Method glyph, dominant `+1`, and the Method name.
- Card Art Studio’s built-in Momentum generator now uses the same non-fire arena design language.
- Locked Momentum colours remain unchanged: Strength orange, Strike red/crimson, Technical green, Agility blue.
- Momentum mechanics and values are unchanged.

### Certification
- **268/268 tests pass**
- Validation: **50 Superstars / 50 decks / 435 gameplay cards / 0 orphans / 0 issues**
- Flow audit: **50 Superstars / 0 issues**
- Card-ID audit: **485 cards / 485 manifest entries / 0 issues**
- Existing static custom-art coverage is unchanged from v0.12.56; the art audit continues to report the same 449 not-yet-exported custom fronts and no new regression from this pass.
