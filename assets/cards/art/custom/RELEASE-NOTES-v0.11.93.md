# WWE Legacy v0.11.93 — Pin Bonus Removal + Health-Only Pins

- Removed the **Pin Bonus** mechanic from all active gameplay cards. The audit found 61 cards with printed or conditional Pin Bonus values.
- Pin chance is now fully **health-driven**: above 60% HP cannot be pinned; 40–60% HP is a 1–3% desperation window; at 40% HP and below, pin chance scales from 15% to 90% at 0 HP. No card can add to or subtract from this chance.
- Removed Pin Bonus from AI move valuation and pin timing logic. CPU pin attempts now key off Red health rather than a last-move Pin Bonus.
- Converted the old conditional Pin Bonus chains into small conditional Damage bonuses: West Coast Pop after 619 (+2), Dominik’s Frog Splash after 619 (+1), Uso Splash after Spear (+1), BFT after Diving Elbow Drop (+1), Twisted Bliss after Sister Abigail (+2), Coup de Grâce after Shotgun Dropkick (+1), and Triple D against an already Stunned opponent (+1).
- **IYO SKY — Bullet Train Attack** now grounds the opponent, replacing its removed Pin Bonus with a useful setup effect for Over the Moonsault.
- **Alexa Bliss — Mind Games** no longer reduces a Pin Bonus. Once per match, after Alexa naturally kicks out of a Pin, it draws 1 page and grants +1 Adrenaline.
- Kept printed Cost/Damage unchanged on the remaining affected cards after a full card-by-card audit; the systemic health-only pin curve is the primary rebalance, avoiding unnecessary power creep.
- Added `PIN-BONUS-REMOVAL-AUDIT-v0.11.93.md` with all 61 affected cards and their treatment.
- Retains the v0.11.92 match HUD safe-area/show-control pass and v0.11.91 Chelsea Green Running Knees to the Back content.
