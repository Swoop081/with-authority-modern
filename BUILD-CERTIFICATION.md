# WWE Legacy v0.13.23 — Build Certification

**King of the Ring Presentation + Coronation Pass**

- **472/472 regression tests pass.**
- Validation: **50 Superstars / 50 decks / 462 gameplay cards / 0 orphans / 0 issues**.
- Flow audit: **50 Superstars / 0 issues**.
- Card-ID audit: **512/512 / 0 issues**.
- Counter-state audit: **462 gameplay cards / 331 Moves / 0 issues**.
- Card-effect audit: **29 test Superstars / 324 gameplay cards / 190 effect-bearing cards / 0 issues**.
- Economy smoke: **60 packs / 300 cards / 0 duplicate Entrance pulls / 0 foil-first failures**.
- Released + RAW pre-release soak: **29 test Superstars / 8,120 matches / 0 stalls / 26.64 average turns / 7,420 pins / 700 submissions**.
- Dead-turn audit: **2,450 matches / 4.39 passes per match / maximum consecutive pass streak 4**.
- Active hidden pre-release scope remains **currently released content + RAW Series 1 only**.

## v0.13.23 certification focus
- King of the Ring retains its **8-Superstar / Quarterfinal → Semifinal → Final / one-loss-elimination** rules.
- The bracket now persists through the run and visibly marks advancing CPU/player winners.
- The Final receives dedicated **KING OF THE RING FINAL** presentation.
- A tournament victory now flows through **match result → coronation → Claim the Crown → choose-one reward**.
- The champion becomes the persistent **Reigning King**, surfaced on the KOTR Play tile and in a compact My Legacy KOTR history panel.
- KOTR still awards exactly **one standard booster total** and never awards boosters per round.
- With exactly three released collectible sets, all three set boosters are offered to the champion.
- With four or more released collectible sets, **three unique released sets are randomly selected** for that tournament.
- Reward options persist in save state and cannot be rerolled by leaving/reopening the screen.
- Only one offered pack can be claimed; the selected booster is added to the normal booster vault.
- Cleared v0.13.22 KOTR runs are migration-protected so their already-paid automatic reward cannot become a second choose-one reward after upgrade.
- Profile schema remains **30**.
- Daily Ladder, Championship Road, Live Events and Exhibition gameplay are unchanged.
- Superstar chase remains **2% natural** with one global **100-miss pity** counter; armed pity can remain banked across completed sets.
- Action taxonomy remains **69 Actions / 0 Special-kind collectible cards**.
- Secondary Superstar unlocks remain capped at **1 Finisher / 1 Trademark / 1 Action**, with no manufactured secondary deck or Superstar-specific Entrance grant.
- No gameplay/card balance, HP, Method limits, Store/economy values, release dates, artwork assets or authored recommended deck blueprints changed.
