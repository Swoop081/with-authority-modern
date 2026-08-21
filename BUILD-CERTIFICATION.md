# WWE Legacy v0.13.92 — Season One Cena + Attitude Rock

Verified content/progression build based directly on **v0.13.90 — Era Logo Presentation Hotfix**. The abandoned v0.13.91 asset-path consolidation work is excluded.

## Locked release changes
- Golden Era uses the clean classic WWF block mark with no added `GOLDEN ERA` text.
- Attitude Era uses the enlarged, re-centred WWF scratch logo treatment.
- Chyna is parked as future content and **The Rock — The People’s Champion** occupies the eighth live Attitude Era Series 1 Superstar slot.
- The former Season 1 Final Boss Rock package is banked for a future reward.
- **John Cena — The Last Time Is Now** is the active Season 1 chase/reward Superstar.
- Season 1 is **50 tiers over 30 days**, from 22 August 2026 through 21 September 2026.
- Each Season tier remains **100 XP**, for **5,000 XP total**.
- Season 1 grants **5 Normal copies each** of Protobomb, Five Knuckle Shuffle, STF and Attitude Adjustment, one copy per milestone.
- Cena’s Hustle, Loyalty, Respect support and Never Give Up Action are also on the road.
- Tier 48 grants the **Ruby The Time Is Now Entrance**; Tier 50 grants the **Ruby John Cena — The Last Time Is Now Superstar**.
- Fresh-start, four-tier collection, CPU role-matched tier scaling, reward economy and five-set live release pool otherwise remain unchanged.

## Verification
- Automated test suite: **786 discovered / 712 passed / 0 failed / 74 intentionally skipped historical contracts**.
- v0.13.92 dedicated Cena/Rock/Season/logo contract: **9/9 passed**.
- Validation: **76 Superstars / 76 decks / 706 gameplay cards / 0 orphans / 0 issues**.
- Collector IDs: **782/782 / 0 issues**.
- Flow audit: **76 Superstars / 0 issues**.
- Card-effect audit: **574 scoped gameplay cards / 388 effect-bearing / 0 issues**.
- Counter/submission-state audit: **0 issues**; John Cena and Attitude Rock each retain 60 pages, 12 Momentum and 10 Counter pages.
- Live-roster simulation: **41 released Superstars / 16,400 matches / 0 stalls / 26.54 average turns**. Attitude Rock recorded 49.5%; John Cena recorded 33.9% and is retained as a live-play balance watch item rather than silently retuned in this content pass.
- Normal-tier exhaustion audit: **16,400 matches / 0 stalls / 99.951% finished before recycle / 0.049% recycle rate**. Fresh Normal CM Punk vs Roman Reigns: **5,000 matches / 0 recycle / 0 stalls**.

## Release interpretation
The build is structurally safe for fresh-save live testing. Cena’s Season package is fully functional and collectible, but his authored CPU-vs-roster simulation rate should be watched during the 30-day Season before any separate balance pass.
