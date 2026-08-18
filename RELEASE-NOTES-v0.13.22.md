# WWE Legacy v0.13.22 — King of the Ring + Daily Ladder Challenge Pass

## Play architecture
- **King of the Ring** replaces standalone Climb the Ladder as a top-level Play mode.
- Each tournament contains **8 Superstars**: the player's selected Superstar plus 7 unique random opponents.
- The player must win a **Quarterfinal, Semifinal and Final** in succession.
- **One loss eliminates the run.** A new bracket can then be started.
- Winning the Final awards **one standard booster**. There are no per-round booster rewards.

## Daily Climb the Ladder Challenge
- Climb the Ladder moves into the **Challenges** screen instead of competing with Championship Road as a permanent Play path.
- Each local day generates a fixed field of **8 unique random opponents** for the selected Superstar.
- A run begins with **3 lives**. Each loss consumes one life.
- Losing all 3 lives ends that attempt and restarts progression at **Level 1**; retrying on the same day uses the same daily opponent field.
- Clearing all 8 levels completes the Ladder for that day and awards the existing Ladder completion reward **once**. No booster is awarded for individual levels.
- Local midnight resets the daily Ladder and produces a new field for the new day.

## Save compatibility
- Existing standalone Ladder runs from older builds are retired when encountered because that mode no longer exists.
- Historical Ladder clear totals and already-earned completion packs are preserved.
- King of the Ring state is additive and save-safe.
- Profile schema remains **30**.

## Unchanged systems
- Championship Road remains the long-form progression/campaign mode.
- Exhibition and Live Events remain unchanged.
- Superstar chase remains **2% natural** with the **global 100-miss pity** introduced in v0.13.21.
- Later Superstar unlocks remain lean: Superstar + at most 1 Finisher, 1 Trademark and 1 Action; no manufactured 60-page deck or Superstar-specific Entrance grant.
- The unified Action taxonomy from v0.13.20 remains unchanged.
- No card balance, HP, Method limits, card identities, Store prices, duplicate values, release dates, normal booster rarity weights, artwork assets or authored recommended deck blueprints changed.

## Certification
- **467/467 tests pass**.
- Validation: **50 Superstars / 50 decks / 462 gameplay cards / 0 orphans / 0 issues**.
- Flow audit: **50 Superstars / 0 issues**.
- Card-ID audit: **512/512 / 0 issues**.
- Counter-state audit: **462 gameplay cards / 331 Moves / 0 issues**.
- Card-effect audit: **29 test Superstars / 324 gameplay cards / 190 effect-bearing cards / 0 issues**.
- Economy smoke: **60 packs / 300 cards / 0 duplicate Entrance pulls / 0 foil-first failures**.
- Released + RAW pre-release soak: **8,120 matches / 0 stalls / 26.64 average turns / 7,420 pins / 700 submissions**.
- Dead-turn audit: **2,450 matches / 4.39 passes per match / maximum consecutive pass streak 4**.
