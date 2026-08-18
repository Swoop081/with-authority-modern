# WWE Legacy: Collectible Card Game

Current working build: **v0.13.23 — King of the Ring Presentation + Coronation Pass**.

A mobile-first WWE collectible card game prototype with 60-page Superstar decks, Method Momentum, Adrenaline, Counters, Submissions, Pins, Deck Lab, Collection, boosters, Store, Seasons, Challenges, Live Event towers, King of the Ring, the Daily Ladder Challenge and Championship Road.

## Current build
- **King of the Ring** is an 8-Superstar single-elimination bracket with a persistent tournament presentation from Quarterfinal through the Final. One loss eliminates the run.
- Winning the Final now flows through a dedicated **coronation**. The winning Superstar becomes the persistent **Reigning King** on the Play tile and in a compact My Legacy tournament-history panel.
- A KOTR champion chooses **1 of 3 different released-set boosters**. With exactly three live sets all three appear; with four or more live sets, three unique sets are randomly locked in when the tournament is won. The reward choices persist and cannot be rerolled.
- The KOTR reward remains exactly **one booster total**, with no per-round booster rewards.
- **Climb the Ladder** remains in Challenges as a daily 8-opponent tower with 3 lives. Losing all 3 restarts the run at Level 1 against the same daily field; local midnight generates a fresh field.
- **Special is retired as a collectible card type.** All 52 former Special cards are Actions while keeping their exact existing reaction/trigger timing and once-per-match mechanics.
- The live gameplay pool contains **69 Actions and 0 Special-kind cards**. Legacy `special-*` card IDs remain intact for save/collector compatibility.
- Deck Lab, Recommended Build, Optimize Owned, Deck Assistance, Collection/Catalogue and Card Art Studio use one canonical **Actions** category.
- Secondary Superstar unlocks remain lean: Superstar identity + at most one authored Finisher, one Trademark and one Action; no shared filler or manufactured 60-page deck is granted.
- Deck Lab builds toward each authored recommendation using only cards already owned and recommends missing authored upgrades as they are collected.
- Superstar chase remains **2% per eligible pack** with **one global 100-miss pity track across all packs**. After 100 misses, pity stays armed until a pack from a set with an unowned Superstar is opened; that set supplies the guaranteed Superstar.
- The first chosen Superstar remains the onboarding exception and receives the complete authored 60-page deck.
- My Legacy Save & Backup remains one stable `WWE-Legacy-Save.json` file with validation, import confirmation and one-step rollback.
- One canonical release calendar controls player availability across Packs, Store, Catalogue, Exhibition matchmaking, Season booster rewards, Live Event rewards and Superstar visibility.
- Season 1 schedule: **RAW — Series 1 (5 Sep 2026)**, **Worlds Collide — Series 1 (26 Sep 2026)**, **Money in the Bank — Series 1 (10 Oct 2026)**, **SmackDown — Series 1 (31 Oct 2026)** and **Survivor Series — Series 1 (28 Nov 2026)**.
- RAW remains available to internal certification before release while staying hidden from players until its configured release day.
- Economy values remain locked at **2,500 UP per Store Superstar**, **300 UP per Store booster**, **10 UP excess Normal**, and **20 UP excess Foil**.

See `RELEASE-NOTES-v0.13.23.md` and `BUILD-CERTIFICATION.md`.
