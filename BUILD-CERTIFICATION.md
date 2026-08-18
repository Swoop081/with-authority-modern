# WWE Legacy v0.13.22 — Build Certification

**King of the Ring + Daily Ladder Challenge Pass**

- **467/467 regression tests pass.**
- Validation: **50 Superstars / 50 decks / 462 gameplay cards / 0 orphans / 0 issues**.
- Flow audit: **50 Superstars / 0 issues**.
- Card-ID audit: **512/512 / 0 issues**.
- Counter-state audit: **462 gameplay cards / 331 Moves / 0 issues**.
- Card-effect audit: **29 test Superstars / 324 gameplay cards / 190 effect-bearing cards / 0 issues**.
- Economy smoke: **60 packs / 300 cards / 0 duplicate Entrance pulls / 0 foil-first failures**.
- Released + RAW pre-release soak: **29 test Superstars / 8,120 matches / 0 stalls / 26.64 average turns / 7,420 pins / 700 submissions**.
- Dead-turn audit: **2,450 matches / 4.39 passes per match / maximum consecutive pass streak 4**.
- Active hidden pre-release scope remains **currently released content + RAW Series 1 only**.

## v0.13.22 certification focus
- Top-level standalone Climb the Ladder is retired from Play and replaced by **King of the Ring**.
- King of the Ring creates an **8-Superstar** bracket: player + 7 unique random opponents.
- The player's path is Quarterfinal → Semifinal → Final; **one loss eliminates the run**.
- Only winning the full King of the Ring tournament awards its **one standard booster**; rounds cannot be farmed for boosters.
- Climb the Ladder is now a **daily Challenges tower** with **8 opponents and 3 lives**.
- The daily opponent field is stable for the local day; losing all 3 lives restarts at Level 1 against that same field.
- Local-midnight rollover resets the Ladder and creates a fresh daily field.
- Ladder completion reward is granted only after all 8 levels and at most once per daily clear; individual levels do not award boosters.
- Legacy standalone Ladder active-run state is retired safely while historical clears and previously awarded packs remain preserved.
- Career records distinguish **King of the Ring**, **Climb the Ladder Challenge**, Exhibition, Live Events and Championship Road.
- A dedicated King of the Ring achievement is included.
- Profile schema remains **30**.
- Superstar chase remains **2% natural** with one global **100-miss pity** counter; armed pity can remain banked across completed sets.
- Action taxonomy remains **69 Actions / 0 Special-kind collectible cards**.
- Secondary Superstar unlocks remain capped at **1 Finisher / 1 Trademark / 1 Action**, with no manufactured secondary deck or Superstar-specific Entrance grant.
- No gameplay/card balance, HP, Method limits, economy values, release dates, artwork assets or authored deck blueprints changed.
