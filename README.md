# WWE Legacy: Collectible Card Game

Current working build: **v0.13.37 — Hub + Selector Consistency Pass**.

A mobile-first WWE collectible card game prototype with 60-page Superstar decks, Method Momentum, Adrenaline, Counters, Submissions, Pins, Deck Lab, Collection, boosters, Store, Seasons, Challenges, Live Events, Money in the Bank, King of the Ring and Championship Road.

## Current build
- **Normal non-final match victories award exactly 1 normal booster.** Losses award **no match reward** and **0 match Season XP**.
- The **final victory that completes a structured mode/tournament awards only its Super Pack**. It does not also grant the normal victory booster or any direct UP. This applies to Live Event tower clears, Money in the Bank, King of the Ring and Championship Road.
- Individual match victories and mode clears award **no direct UP**. Overflow duplicates inside opened packs remain the repeatable UP source at **1 Common / 2 Uncommon / 3 Rare / 4 Very Rare UP**, including Foil overflow.
- Super Packs remain 5 cards with a guaranteed Foil Rare-or-better first pull, **25/40/27/8** rarity weighting and a maximum of 2 Very Rares.
- Super Pack reveal flow now uses the same explicit final-card transition as standard boosters: tapping **Card 5 of 5** always advances to **Pack Summary**, including duplicate/UP-conversion outcomes.
- Deck Lab `Optimize Owned` and `Build Toward Recommended` are hard-gated by actual Collection inventory. Automatic builds cannot insert or increase cards beyond owned Normal + Foil copies, and Deck Validity/Save rejects unowned or over-owned pages.
- **Hangman Armbar — SVS1-054** remains the latest gameplay addition: shared 1★ Common, C3/D0, Technical 1, standing-only Arm Submission, Arm Extended, +3 persistent Arm damage per successful turn.
- Rotating Live Events remain release-gated, universal layered-card lookup remains active, counter/reversal Play Pile duplication remains fixed, Pack Complete cards retain the ~60% inspector, and optional triggered cards such as Tribal Chief retain the Use/Decline flow from v0.13.35.
- Profile schema remains **31**.
- Live Events hub cards are denser and information-led: Superstar renders are removed, event titles are larger, and CTA/timer controls are split left/right without overlap.
- Superstar selection now uses one shared horizontal carousel across Exhibition, Deck Lab and other character-pick surfaces. First tap selects; a second tap on the selected Superstar flips to details.
- The Home Season tile now follows the same headline typography/spacing system as Deck Lab and My Challenges.
- The Season screen keeps Season context plus the Free Booster claim/countdown sticky while the 100-tier road auto-focuses and scrolls beneath it.
- Recently themed stat tiles now use full alternating theme/white fills rather than black panels with colored accents. The King of the Ring hero is tightened to remove the unused vertical gap above its stat row.

Season 1 release schedule remains: **RAW — Series 1 (5 Sep 2026)**, **Worlds Collide — Series 1 (26 Sep 2026)**, **Money in the Bank — Series 1 (10 Oct 2026)**, **SmackDown — Series 1 (31 Oct 2026)** and **Survivor Series — Series 1 (28 Nov 2026)**.

See `RELEASE-NOTES-v0.13.37.md` and `BUILD-CERTIFICATION.md`.
