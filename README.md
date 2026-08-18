# WWE Legacy: Collectible Card Game

Current working build: **v0.13.18 — Superstar Starter Deck + Recommended Build Assistance**.

A mobile-first WWE collectible card game prototype with 60-page Superstar decks, Method Momentum, Adrenaline, Counters, Submissions, Pins, Deck Lab, Collection, boosters, Store, Seasons, Challenges, Live Event towers, Ladder and Championship Road.

## Current build
- One canonical release calendar now controls player availability across Packs, Store, Catalogue, Exhibition matchmaking, Season booster rewards, Live Event rewards and Superstar visibility.
- Launch sets remain live from install. Future authored sets unlock automatically at local midnight on their configured release date.
- Season 1 schedule: **RAW — Series 1 (5 Sep 2026)**, **Worlds Collide — Series 1 (26 Sep 2026)**, **Money in the Bank — Series 1 (10 Oct 2026)** and **SmackDown — Series 1 (31 Oct 2026)**.
- Survivor Series — Series 1 is also calendar-gated for **28 Nov 2026**; Season-exclusive Goldberg remains separately gated.
- RAW remains available to internal certification before September 5 while staying hidden from players until its release day.
- Daily Store rotation expands only with sets that are actually released. Unreleased sets can never become the active Store set.
- Monday RAW and Saturday SmackDown Live Event rewards automatically switch to their branded subset only after that subset releases; before release they use a live fallback pack.
- The 90-day economy simulator now follows the real release calendar rather than holding the launch pool static.
- Economy values remain locked at **2,500 UP per Store Superstar**, **300 UP per Store booster**, **10 UP excess Normal**, and **20 UP excess Foil**.
- My Legacy Save & Backup remains one stable `WWE-Legacy-Save.json` file with validation, import confirmation and one-step rollback.

See `RELEASE-NOTES-v0.13.18.md` and `BUILD-CERTIFICATION.md`.
