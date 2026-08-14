# WWE Legacy: Collectible Card Game — v0.12.12
## Public Launch Pool + Roman Ooh Ahh!! Pass

v0.12.12 restores the player-facing game to the intended **Season 1 launch state** while preserving all already-authored future content safely inside the development build.

### Public launch pool
Only the three launch series are live in normal player-facing systems:
- **SummerSlam — Series 1**
- **Hall of Fame — Series 1**
- **Evolution — Series 1**

That produces a public launch pool of **24 Superstars and 271 collector cards**. The Season 1 Final Boss reward remains a visible Season chase and can surface in the player's owned Collection/Catalogue once earned.

The already-authored future sets remain in development data but are hidden from the live game until deliberately released:
- Raw — Series 1
- Worlds Collide — Series 1
- Money in the Bank — Series 1
- SmackDown — Series 1
- Survivor Series — Series 1
- Season 2 Who's Next reward content

Future Superstar names are no longer revealed in the Season roadmap copy.

### Release gating
Player-facing release gates now cover:
- Exhibition CPU opponent pools
- Superstar selection/unlocked roster surfaces
- Collection
- Card Catalogue
- Deck Lab owned-card and Entrance browsers
- Booster eligibility and Booster Vault
- Challenges/set-collection progress
- Home counts and launch collection totals
- Match presentation show selection

Future authored cards cannot be opened from boosters while their set is unreleased. Their data, decks, collector numbers, mechanics and Card Art Studio records remain intact for continued development.

### Existing-profile cleanup
Profile schema moves to **v21**. On migration, stale development-state data is removed from the player profile:
- unreleased Superstar unlocks/favourites
- unreleased owned cards
- unreleased saved decks and selected Entrances
- unreleased booster credits
- unreleased Ladder/Championship pack credits
- unreleased unlock celebrations

This does not delete the authored development content from the build; it only prevents it leaking into normal play.

### Roman Reigns — SummerSlam Series 1
**Sitout Crucifix Powerbomb is retired** from Roman's current-era card pool and recommended deck.

Its collector slot is reused rather than leaving a numbering hole:
- **SS1-034 — Ooh Ahh!!**
- SS1-035 onward remain unchanged.

**Ooh Ahh!!**
- Roman Reigns-exclusive Action
- 2★ Uncommon
- Cost 2
- Unique / max 1 copy in deck
- Search/draw **Roman's Spear**.
- If Roman's Spear is already in hand, gain **+1 Adrenaline** instead.
- Roman's next Spear this Control sequence costs **1 less**.

Roman's recommended deck remains exactly 55 pages. The two removed Crucifix Powerbomb copies become:
- **1× Ooh Ahh!!**
- **1× additional Headbutt**

### Preserved rules
- The v0.12.11 global rule remains enforced: **Finishers have no Method Momentum requirements**.
- No Pin Bonus mechanics were reintroduced.
- No future Superstar/card design was deleted or rebalanced as part of this release-state pass.

### Validation
- **94/94 automated tests pass**.
- Public live pool: **24 Superstars / 271 launch cards**.
- Authored development database: **50 Superstars / 50 complete recommended decks**.
- **422 gameplay cards / 472 collector-manifest cards**.
- **0 orphan cards / 0 rebuild issues**.
- Card-ID audit clean and gap-free.
- Flow audit clean.
- Card Art Studio data regenerated.
- Deterministic full authored-roster simulation: **2,450 matches / 0 stalls / 36.39 average turns**.
- Finish distribution: **2,014 pins / 308 submissions / 128 turn-limit draws**.
