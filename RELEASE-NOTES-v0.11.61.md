# WWE Legacy v0.11.61 — Cinematic Match Flow + HUD + Momentum Control Fix

- Cleans the Exhibition Showcase: removes explanatory/opponent-pool copy and duplicate Superstar-name overlays from selection cards.
- Confirming a Superstar now goes directly to a **TONIGHT’S MAIN EVENT** matchup reveal; the CPU opponent stays hidden until this screen.
- Adds randomized non-Hall-of-Fame show presentation using existing SummerSlam, Evolution, RAW and Worlds Collide branding/themes.
- Keeps the user Superstar on the left and CPU on the right throughout presentation, independent of actual first Control.
- Adds two-stage pre-match Entrance presentation: player first, CPU second; Superstar card transitions to the Entrance card, cards can flip, Entrance benefits appear as callout chips, and Next advances the sequence.
- Removes Entrance cards from the live Play Pile once actual gameplay begins.
- Rebuilds the in-match HUD with full wrestler artwork, player left / CPU right, large remaining-HP display with green/amber/red health states, body-part submission damage, and five resource indicators only: Agility, Strength, Strike, Technical and white Adrenaline.
- Adds tappable Superstar HUD presentation: open at roughly 60% screen size, tap to flip, tap backdrop to close.
- Fixes the oversized set/show logo rendering over Momentum cards.
- **Gameplay fix:** Momentum allowance is now tracked per Control sequence. A wrestler may play one Momentum before a Move each time they newly gain Control; if Control leaves and later returns, Momentum becomes available again. Retaining Control does not reset the allowance.
- Preserves all 33 locked 55-page decks, all collector IDs, all Studio assignments and all Season 1 content through Worlds Collide Series 1.
