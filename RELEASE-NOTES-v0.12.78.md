# WWE Legacy v0.12.78 — Career Record + Achievements + Lay The Smack Down

Career-history and Final Boss identity pass built on v0.12.77 Weekly Live Events.

- **My Legacy now keeps the player’s permanent match record** from this build forward. Every completed match records a Win or Loss.
- Career history is split three ways: **overall W/L**, **W/L with every unlocked Superstar**, and **W/L in every game mode** (Exhibition, Weekly Live Event, Climb the Ladder and Championship Road).
- Win percentage is shown alongside each record. Match finish type is also retained internally for achievement tracking.
- Existing profiles begin exact W/L tracking at **0–0 from v0.12.78** rather than inventing historical match results that older saves never stored. Existing Ladder, Championship Road and Weekly Live Event clear counters remain intact and can legitimately satisfy their corresponding achievements.
- **14 launch achievements** are now tracked in My Legacy: First Bell, Winner’s Circle, Ten Victories, Main Eventer, Living Legend, Century Club, All-Terrain Superstar, Locker Room Leader, Roster General, Pinfall Specialist, Submission Specialist, Ladder Conqueror, Championship Gold and Live Event Headliner.
- Achievement state is persisted with the local profile and My Legacy shows earned/locked status.
- Season 1 Final Boss card **S1FB-001 Final Boss Slap** is retired and replaced by **Lay The Smack Down**. It remains a Rock-exclusive **Rare (3★) Strike Move** at **Cost 4 / Damage 7 / requires 2 Strike**, removes 1 opponent Adrenaline on connect, and retains the Arm Extended counter state.
- The replacement keeps collector slot **S1FB-001** and all existing normal/Foil ownership is migrated automatically. Saved deck references are rewritten to the replacement ID before normal deck validation.
- Tier 5 of the Final Boss Reward Road now awards **Lay The Smack Down**. The Rock’s authored deck uses the replacement and contains no retired Final Boss Slap entries.
- No other card costs, damage, effects, rarities, ownership caps, Superstar HP, set composition, booster odds, pin rules, submission rules, counter rules or game-mode reward values were changed.
