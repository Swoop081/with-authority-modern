# WWE Legacy v0.12.55 — Entrance Chase + Final Boss Reward Road

v0.12.55 supersedes v0.12.54 as the current working baseline.

This release combines the latest iPhone presentation fixes with a major Entrance-economy rebuild and a progressive Season 1 Final Boss reward road.

### Launch / Home presentation
- The existing dedicated Final Boss Rock render is unchanged, but the launch **THE FINAL BOSS AWAITS.** promotion now lets Rock fill the full left side from top to bottom with a controlled crop and right-edge fade into the copy.
- Home **PACKS**, **UP**, **SUPERSTARS**, **COLLECTION**, and **SEASON** labels/readouts are materially enlarged for iPhone readability, with the hero stats reflowed to avoid collisions.
- The redundant onboarding confirmation **“[Superstar] is now your starter Superstar.”** is removed.

### Entrance economy
- Superstar-specific Entrances are no longer automatically granted when a Superstar is unlocked.
- Native Superstar Entrances are **4★ Very Rare Foil** pulls in their Superstar's own live set booster, preserving the established all-Entrances-are-Foil rule.
- Entrances have a hard ownership/deck cap of **1**. Once pulled, that Entrance is excluded from all later booster pulls, including remaining cards in the same pack.
- CPU decks retain their authored native Superstar Entrances.
- Pulling a native Entrance does **not** auto-equip it; the player chooses it manually in Deck Lab.
- Entrance-specific mechanics now check the actually equipped Entrance, preventing native Entrance bonuses from firing while another Entrance is selected.

### New Legacy baseline
- Adds shared **Amazing Entrance** (`SS1-142`) as a 4★ Very Rare starting Entrance.
- Amazing Entrance effect: **Pre-Match: Begin with +1 Adrenaline.**
- Amazing Entrance is automatically owned/equipped **Foil** for a new player and is not booster-pullable.
- New profiles receive **15 Strength, 15 Strike, 15 Technical, and 15 Agility Momentum**.
- Momentum ownership cap is 15; the existing **12-copy per 60-page deck** Momentum limit remains unchanged.
- Newly unlocked player Superstars continue using Amazing Entrance until an owned native Entrance is manually assigned.
- Profile schema is **27** and migrates older saves into the new Entrance/Momentum baseline.

### Season 1 — Final Boss progressive rewards
The Rock — Final Boss no longer arrives at Tier 50 with a complete 60-card player deck. His prestige package is assembled across the Season road:

- **Tier 5:** Final Boss Slap ×1 + existing 100 UP value
- **Tier 10:** Rock Bottom ×3 — Signature / Trademark + existing 100 UP value
- **Tier 15:** Belt Whip ×3 + existing 100 UP value
- **Tier 20:** Bloodline Rules ×1 — Special + existing 100 UP value
- **Tier 25:** People's Championship ×1 — Exclusive Support + existing 200 UP value
- **Tier 30:** People's Elbow ×2 — Finisher + existing 200 UP value
- **Tier 40:** Final Boss Entrance ×1 — Foil; owned but not auto-equipped
- **Tier 50:** The Rock — Final Boss Superstar card / identity only

Exclusive Move quantities match the authored CPU Final Boss deck. Shared cards needed for a player Rock deck must come from the player's normal Collection. Tiers 35 and 45 retain their standalone 200 UP rewards. Existing profiles backfill milestone rewards for tiers already claimed without deleting previously owned cards.

### Content / collector accounting
- Adds **Amazing Entrance**, bringing the active gameplay-card total to **435**.
- Collector manifest / Card Art Studio remain synchronized at **485 cards**.

### Certification
- **257/257 tests pass**
- Validation: **50 Superstars / 50 decks / 435 gameplay cards / 0 orphans / 0 issues**
- Flow audit: **50 Superstars / 0 issues**
- Card-ID audit: **485 cards / 485 manifest entries / 0 issues**
