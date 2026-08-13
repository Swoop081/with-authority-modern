# WWE Legacy v0.11.83 — Pin Probability Overhaul + Final Season 1 Simulation Balance Pass

## Pin model
- Pins remain unavailable above 60% HP.
- HUD danger bands are now Green >60%, Amber 40–60%, Red <=40%.
- Amber pin success is intentionally tiny: 1–3% baseline and hard-capped at 8% even after Pin Bonus.
- Red health is the real finishing phase: chance rises sharply as HP falls, with Pin Bonus becoming meaningful there.
- CPU avoids wasteful amber covers and will prefer a legal Finisher over an immediate low-value cover.

## Simulation / AI correctness
- Submission AI now maintains holds against the actual Superstar-specific submission threshold rather than an obsolete fixed 12-point assumption.
- Bayley and Becky receive sequence-aware CPU decision logic; Damian/Tiffany finishing sequences are preserved rather than interrupted by low-value covers.
- Added `npm run final-balance`, a 3,280-match four-game alternating-side Season 1 round robin with pin-zone and finish-type telemetry.

## Final targeted balance pass
- Roman Reigns: Head of the Table now triggers once per match rather than twice; he remains deliberately top-tier among regular Superstars.
- Raquel Rodriguez: 52 HP, no starting Adrenaline from Big Mami Cool, big-hit defensive special now requires 10+ damage, Tejana Bomb 13 damage.
- Charlotte Flair: Genetically Superior reduced to two triggers / 1-point Agility discount; counter Special grants +1 Adrenaline; Figure-Eight Leglock is C10, requires 2 Technical, Pressure 4.
- Logan Paul: 46 HP, Brass Knuckles bonus reduced to 1 with no Stun, Paulverizer 13 damage / Pin Bonus +3, and recommended deck burst density reduced.
- Bayley: Role Model Entrance adds +1 Strike Momentum and recommended deck now carries a third Rose Plant.
- Becky Lynch: The Man now draws 1 while granting the Technical discount, Straight Fire begins with +1 Technical Momentum, and her counter Special tutors/discounts Dis-arm-her; recommended deck carries a third Manhandle Slam.
- Damian Priest: The Punishment is +3 damage, Rise of the Punisher adds +1 Strike Momentum, South of Heaven discounts the next Finisher by 2, and Last Rites chooses a grounding Trademark while the opponent is standing or a Finisher once grounded.

## Final simulation result
- 3,280/3,280 matches completed with 0 stalls.
- Average match length: ~33.7 turns under the much later pin model.
- The Rock remains the intentional prestige outlier.
- Regular-roster top cluster is now Roman/Charlotte/Raquel in the mid-60s, with the broad competitive field concentrated around roughly 38–60%.
- Damian and Becky recover into the competitive middle after AI/mechanics corrections.
