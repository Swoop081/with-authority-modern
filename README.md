# WWE Legacy: Collectible Card Game

Current working build: **v0.13.24 — iPhone Interface + Championship Road Campaign Pass**.

A mobile-first WWE collectible card game prototype with 60-page Superstar decks, Method Momentum, Adrenaline, Counters, Submissions, Pins, Deck Lab, Collection, boosters, Store, Seasons, Challenges, Live Events, Money in the Bank, King of the Ring and Championship Road.

## Current build
- **Championship Road** is now a continuous, graphic-heavy **24-match Season 1 campaign map** instead of four small era tabs. The road is divided into six four-match themes: Golden Era, SummerSlam Part I, Evolution Part I, Attitude Era, SummerSlam Part II and Evolution Part II.
- Championship Road now owns the four-step difficulty progression: **Easy → Normal → Hard → Hardcore**. Easy opponents begin at **-5 HP**, Normal uses printed HP, Hard begins at **+5 HP**, and Hardcore begins at **+10 HP**. The player Superstar's HP is unchanged. The full campaign therefore contains **96 match clears** across all four difficulties.
- Higher Championship Road difficulties unlock only after completing the entire 24-match road on the previous difficulty. Each difficulty tracks its own completion and best-stage progress.
- To prevent the expanded 96-match campaign becoming a pack farm, Championship Road standard boosters are awarded at the **end of each four-match themed region**, not after every individual win. A complete 24-match road still awards the existing Championship Pack, and the first full Road clear with a Superstar retains its existing first-clear bonus.
- **Money in the Bank** is the player-facing name of the former daily Ladder challenge and now lives in **Live Events**, not My Challenges. Its rules are unchanged: 8 fixed daily opponents, 3 lives, losing all 3 restarts at Level 1 against the same daily field, local midnight refreshes the field, and one completion reward is awarded.
- **King of the Ring** retains its 8-Superstar single-elimination rules, coronation and choose-1-of-3 booster reward. Its tournament display is now a true Superstar-card bracket: Quarterfinals use a horizontal 8-person bracket, Semifinals contract to four Superstars on one screen, and the Final contracts to the last two.
- The **Season 1 Road** is now a colourful graphic 100-tier progression track with large reward nodes, prominent Final Boss milestones, a Season-end countdown, and automatic focus on the player's current tier when the screen opens.
- **My Challenges** is now a compact content-first hub with no Superstar hero and no Money in the Bank block. Daily, Weekly and Set Milestone sections use stronger category/set colour and reward presentation.
- **Live Events** now includes Money in the Bank and uses the approved split-title typography for tower names, including Powerhouse Collision, Submission Specialists and Legends Collide.
- **Exhibition** selection removes the redundant header Superstar render and oversized selector frames, enlarges the Exhibition Showcase branding and keeps the owned Superstar cards as the focus.
- **Packs**, **My Collection**, **Card Catalogue** and **My Legacy** remove redundant hero renders/repeated headings and use tighter iPhone-first spacing so useful content appears sooner.
- **Store** removes the featured Superstar hero, presents Featured Superstars as a two-column vertical grid, applies the approved display typography to major sections, and gives **UP prices a bright gold currency treatment**. Store prices remain unchanged at 300 UP per booster and 2,500 UP per Superstar.
- The Home Season tile and global **PACKS / UP** header typography have been tightened to match the approved WWE Legacy display system while preserving clear numeric values beneath the labels.
- **Special remains retired as a collectible card type**: all 52 former Specials are Actions while preserving their original reaction/trigger timing. The gameplay pool contains 69 Actions and 0 Special-kind cards.
- Secondary Superstar unlocks remain lean: Superstar identity + at most one authored Finisher, one Trademark and one Action; no shared filler, manufactured 60-page deck or Superstar-specific Entrance is auto-granted.
- Superstar chase remains **2% per eligible pack** with one global **100-miss pity** track. Completed-set packs cannot consume armed pity, allowing it to remain banked for the first eligible pack of a later set.
- The expanded Achievements / Achievement Points / Career Score proposal remains **on hold** and is not part of this build.
- Profile schema remains **30** and existing save/export/import compatibility is preserved.

Season 1 release schedule remains: **RAW — Series 1 (5 Sep 2026)**, **Worlds Collide — Series 1 (26 Sep 2026)**, **Money in the Bank — Series 1 (10 Oct 2026)**, **SmackDown — Series 1 (31 Oct 2026)** and **Survivor Series — Series 1 (28 Nov 2026)**.

See `RELEASE-NOTES-v0.13.24.md` and `BUILD-CERTIFICATION.md`.
