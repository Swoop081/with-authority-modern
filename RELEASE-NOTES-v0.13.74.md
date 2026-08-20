# WWE Legacy v0.13.74 — RAW Live + New Generation Schedule Pass

## Summary
This pass promotes **RAW — Series 1** to live status, shifts the **5 September 2026** planned subset slot to **New Generation — Series 1**, expands Championship Road with eight RAW opponents, and adds a second randomized clean-launch splash ad focused on the RAW release.

## Included changes
- **RAW released now**
  - `raw-series-1` is player-live as of **20 August 2026**.
  - RAW cards are booster-eligible under the shared release calendar.
  - RAW Superstars are available on player-facing roster surfaces that respect release state.

- **Schedule update**
  - `new-generation-series-1` now owns the **5 September 2026** release date.
  - New Generation remains hidden before release but is no longer marked development-only.

- **Championship Road expansion**
  - Road length increases from **24** to **32**.
  - Two new sections are appended:
    - **Raw · Part I**
    - **Raw · Part II**
  - Added RAW opponent group:
    - Sol Ruca
    - Chad Gable
    - Raquel Rodriguez
    - Logan Paul
    - Roxanne Perez
    - Austin Theory
    - Montez Ford
    - Joe Hendry

- **Splash screen rotation**
  - Existing **The Final Boss Awaits** splash remains.
  - New alternate splash advertises **RAW IS HERE**.
  - RAW promo uses overlapping Superstar-card presentation featuring:
    - Logan Paul
    - Raquel Rodriguez
    - Sol Ruca
  - One of the two promos is selected randomly each time the game loads.

- **Set / roadmap / store metadata updates**
  - Season roadmap copy reflects RAW live now and New Generation on 5 September.
  - Store rotation metadata now includes New Generation as a scheduled future set.
  - Profile set progress scaffolding now tracks both RAW and New Generation states.

## Certification
- `npm test`
- **697 / 697 tests passed**
