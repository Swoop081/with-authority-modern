# WWE Legacy — Core Wrestling Fundamentals Audit
## v0.11.23

### Goal
Freeze a sensible shared wrestling vocabulary **before** the user commits to producing hundreds of finished WebP fronts. Shared techniques should live primarily in the foundational SummerSlam set; Superstar-specific variants remain separate when they are more powerful or flavorful.

### Existing foundation retained
The active SummerSlam pool already covered the major basics: Arm Drag, Side Headlock, Shoulder Tackle, Running Forearm, Uppercut, Snapmare, Bodyslam, Clothesline, Dropkick, Big Boot, Superkick, DDT, Neckbreaker, Backbreaker, Snap Suplex, German Suplex, Belly-to-Belly Suplex, Spinebuster, Powerslam, Boston Crab, Armbar, Powerbomb, Chain Wrestling and several other mid-tier techniques. These were not duplicated merely to fill space.

### Newly activated shared cards
| Code | Move | Cost | Damage | Requirement | Notes |
|---|---|---:|---:|---|---|
| SS1-136 | Punch | 2 | 4 | 1 Strike | Shared punch-family baseline |
| SS1-137 | Front Kick | 2 | 4 | 1 Strike | Shared kick baseline |
| SS1-138 | Stomp | 2 | 4 | 1 Strike | Standing Above |
| SS1-139 | Hip Toss | 2 | 4 | 1 Technical | Draw 1 on connect |
| SS1-140 | Elbow Drop | 3 | 5 | 1 Strike | Standing Above |
| SS1-141 | Knee Drop | 3 | 5 | 1 Strike | Standing Above |
| SS1-142 | Leg Drop | 3 | 5 | 1 Agility | Standing Above |
| SS1-143 | Vertical Suplex | 4 | 7 | 1 Technical + 1 Strength | Scoop family |
| SS1-144 | Russian Leg Sweep | 4 | 7 | 1 Technical | Leg-sweep family |
| SS1-145 | Bulldog | 4 | 7 | 1 Technical | Bulldog baseline |
| SS1-146 | Sleeper Hold | 5 | 1 | 1 Technical | Head submission; 3 pressure |
| SS1-147 | Irish Whip | 2 | 0 | 1 Technical | Draw 1; opponent remains Standing |
| SS1-148 | Knife-Edge Chop | 2 | 4 | 1 Strike | Shared chop baseline |
| SS1-149 | Drop Toe Hold | 2 | 4 | 1 Technical | Shared takedown |
| SS1-150 | Fireman's Carry | 3 | 5 | 1 Strength | Shared carry/takedown |
| SS1-151 | Schoolboy | 2 | 4 | 1 Technical | +5 pin bonus |
| SS1-152 | Small Package | 3 | 5 | 1 Technical | +7 pin bonus |

All seventeen were appended after SS1-135. A direct v0.11.22 → v0.11.23 collector-code comparison shows **0 changes to existing cards**.

### Punch-family hierarchy
The new generic `Punch` is deliberately the baseline. Active personalized versions remain separate:

- Cody Rhodes — Drop-Down Punch: same base damage but draws 1 on connect.
- Roman Reigns — Superman Punch: signature-tier Cost 7 / Damage 11 and searches for Spear.
- Hulk Hogan — Hogan's Punch: Damage 5.
- Ultimate Warrior — Warrior Punch: Cost 2 / Damage 5.
- Stone Cold Steve Austin — Stone Cold Right Hands: Cost 2 / Damage 5.
- Undertaker — Undertaker Right Hands: Cost 2 / Damage 5.
- Mankind — Mankind Right Hands: baseline damage plus opponent discard.
- The Rock — Final Boss Punches and Final Boss Right Hand remain Rock-specific, stronger Rewards variants.
- Hall of Fame shared `Right Hand` is tagged as part of the same punch family but remains a separate low-cost generic technique.

This keeps personalized punches collectible and mechanically worthwhile instead of collapsing them into the generic Punch.

### Active-pool result
- SummerSlam — Series 1: 152 cards / 118 Moves
- Hall of Fame — Series 1: 106 cards / 67 Moves
- Evolution — Series 1: 110 cards / 78 Moves
- Rewards: 21 cards / 15 Moves
- Total: **389 active collectibles / 278 active Moves**

### Art-production safeguard
The Card Art Studio and in-game finished-front resolver now share the same collector-coded filename key. For example, Punch exports as `ss1-136-punch.webp` and the game looks for exactly that filename first. Raw-ID filenames remain a secondary compatibility fallback.

### Validation
- 179/179 automated tests passing
- 389/389 artwork audit
- 0 full-25 certification issues
- 0 legal-offense AI passes
- 10,000 matches: 0 stalls, 46 draws
