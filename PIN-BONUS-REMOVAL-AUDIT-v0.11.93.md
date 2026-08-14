# WWE Legacy v0.11.93 — Pin Bonus Removal Audit

## Decision

Pin Bonus has been removed from the active game. Pin chance is now based only on the defending Superstar's remaining HP: Green (>60%) cannot be pinned, Amber (40–60%) stays at 1–3%, and Red (≤40%) scales from 15% to 90% at 0 HP. No Move, Superstar, Special, combo, AI score or UI rule text can add to or subtract from pin chance.

## Scope

- 61 active gameplay cards previously carried a printed or conditional Pin Bonus.
- Alexa Bliss — Mind Games also modified Pin Bonus and was converted to a natural kick-out reward.
- Conditional Pin Bonus chains were converted to conditional Damage so their combo identity survives without touching pin odds.
- Printed Cost/Damage was left unchanged unless the card needed a replacement effect; the global health-only pin curve carries the systemic rebalance instead of inflating dozens of Moves.

## Card-by-card audit

| Card | Set | Old Pin effect | v0.11.93 treatment |
|---|---|---|---|
| Diving Crossbody | summerslam-series-1 | +2 | Removed; C/D retained. |
| Cody Cutter | summerslam-series-1 | +4 | Removed; C/D retained. |
| Cross Rhodes | summerslam-series-1 | +4 | Removed; C/D retained. |
| Sitout Crucifix Powerbomb | summerslam-series-1 | +2 | Removed; C/D retained. |
| Roman's Spear | summerslam-series-1 | +2 | Removed; C/D retained. |
| Falcon Arrow | summerslam-series-1 | +2 | Removed; C/D retained. |
| Frog Splash | summerslam-series-1 | +2 | Removed; C/D retained. |
| Pedigree | summerslam-series-1 | +2 | Removed; C/D retained. |
| Phoenix Splash | summerslam-series-1 | +3 | Removed; C/D retained. |
| Curb Stomp | summerslam-series-1 | +4 | Removed; C/D retained. |
| Diving Elbow Drop | summerslam-series-1 | +2 | Removed; C/D retained. |
| G.T.S. | summerslam-series-1 | +4 | Removed; C/D retained. |
| F-5 | summerslam-series-1 | +4 | Removed; C/D retained. |
| Fisherman Buster | summerslam-series-1 | +2 | Removed; C/D retained. |
| Swanton Bomb | summerslam-series-1 | +3 | Removed; C/D retained. |
| Pop-Up Powerbomb | summerslam-series-1 | +3 | Removed; C/D retained. |
| Stunner | summerslam-series-1 | +4 | Removed; C/D retained. |
| Fall From Grace | summerslam-series-1 | +4 | Removed; C/D retained. |
| Atomic Leg Drop | hall-of-fame-series-1 | +3 | Removed; C/D retained. |
| Warrior Splash | hall-of-fame-series-1 | +3 | Removed; C/D retained. |
| Riptide | evolution-series-1 | +4 | Removed; C/D retained. |
| Manhandle Slam | evolution-series-1 | +4 | Removed; C/D retained. |
| Oblivion | evolution-series-1 | +4 | Removed; C/D retained. |
| Rose Plant | evolution-series-1 | +3 | Removed; C/D retained. |
| Spear | evolution-series-1 | +2 | Removed; C/D retained. |
| Natural Selection | evolution-series-1 | +3 | Removed; C/D retained. |
| Vaquer Inferno | evolution-series-1 | +3 | Removed; C/D retained. |
| Bullet Train Attack | evolution-series-1 | +2 | Removed; now Grounds opponent to preserve Trademark/setup value. |
| Over the Moonsault | evolution-series-1 | +3 | Removed; C/D retained. |
| People's Elbow | season-1-final-boss | +5 | Removed; C/D retained. |
| Standing Moonsault | raw-series-1 | +1 | Removed; C/D retained. |
| 450 Splash | raw-series-1 | +2 | Removed; C/D retained. |
| Paulverizer | raw-series-1 | +3 | Removed; C/D retained. |
| Sol Snatcher | raw-series-1 | +5 | Removed; C/D retained. |
| Chaos Theory | raw-series-1 | +2 | Removed; C/D retained. |
| Corkscrew Splash | raw-series-1 | +2 | Removed; C/D retained. |
| Tejana Bomb | raw-series-1 | +3 | Removed; C/D retained. |
| Mysterio Express | worlds-collide-series-1 | +2 | Removed; C/D retained. |
| West Coast Pop | worlds-collide-series-1 | +4 → +6 after 619 | Removed; 619 combo now +2 Damage. |
| Dominik’s Frog Splash | worlds-collide-series-1 | +4 → +5 after 619 | Removed; 619 combo now +1 Damage. |
| Penta Driver | worlds-collide-series-1 | +2 | Removed; C/D retained. |
| Mexican Destroyer | worlds-collide-series-1 | +4 | Removed; C/D retained. |
| Jumping Headbutt | worlds-collide-series-1 | +2 | Removed; C/D retained. |
| Loaded Mask Headbutt | worlds-collide-series-1 | +4 | Removed; C/D retained. |
| Uso Splash | money-in-the-bank-series-1 | +4 → +5 after Spear | Removed; Spear combo now +1 Damage. |
| Burning Hammer | money-in-the-bank-series-1 | +2 | Removed; C/D retained. |
| BFT | money-in-the-bank-series-1 | +4 → +5 after Diving Elbow Drop | Removed; Diving Elbow Drop combo now +1 Damage. |
| Code Red | money-in-the-bank-series-1 | +2 | Removed; C/D retained. |
| Sister Abigail | money-in-the-bank-series-1 | +2 | Removed; C/D retained. |
| Twisted Bliss | money-in-the-bank-series-1 | +4 → +6 after Sister Abigail | Removed; Sister Abigail combo now +2 Damage. |
| Mind Games | money-in-the-bank-series-1 | −2 to the opponent’s Pin Bonus | Pin modifier removed; after Alexa naturally kicks out, draw 1 and gain +1 Adrenaline. |
| 1916 | money-in-the-bank-series-1 | +2 | Removed; C/D retained. |
| Coup de Grâce | money-in-the-bank-series-1 | +4 → +5 after Shotgun Dropkick | Removed; Shotgun Dropkick combo now +1 Damage. |
| Very Nice, Very Knee-vil | smackdown-series-1 | +2 | Removed; C/D retained. |
| Triple D | smackdown-series-1 | +4 / +5 vs Stunned | Removed; now +1 Damage vs an already Stunned opponent. |
| Prettiest Moonsault Ever | smackdown-series-1 | +4 | Removed; C/D retained. |
| I’m Prettier | smackdown-series-1 | +2 | Removed; C/D retained. |
| Green With Envy | smackdown-series-1 | +4 | Removed; C/D retained. |
| South of Heaven | smackdown-series-1 | +2 | Removed; C/D retained. |
| Hit the Lights | smackdown-series-1 | +4 | Removed; C/D retained. |
| Breakker’s Spear | survivor-series-series-1 | +4 | Removed; C/D retained. |

## Conditional combo conversions

- West Coast Pop: after 619, +2 Damage.
- Dominik’s Frog Splash: after 619, +1 Damage.
- Uso Splash: after Spear, +1 Damage.
- BFT: after Diving Elbow Drop, +1 Damage.
- Twisted Bliss: after Sister Abigail, +2 Damage.
- Coup de Grâce: after Shotgun Dropkick, +1 Damage.
- Triple D: +1 Damage if the opponent was already Stunned.

## Simulation check

The post-removal health-only pin curve was tested over 3,444 deterministic roster matches. It produced no stalls and kept pins concentrated entirely in Red health under CPU strategy. The mechanic change does shift some wrestler balance because high-damage archetypes no longer compete against card-specific pin modifiers; this should be treated as the new baseline for the next roster balance pass rather than reintroducing Pin Bonus.
