# WWE Legacy: Collectible Card Game

Current working build: **v0.13.31 — Automatic Layered Front Fallback + Biel Toss Pass**.

A mobile-first WWE collectible card game prototype with 60-page Superstar decks, Method Momentum, Adrenaline, Counters, Submissions, Pins, Deck Lab, Collection, boosters, Store, Seasons, Challenges, Live Events, Money in the Bank, King of the Ring and Championship Road.

## Current build
- Layered Card Front v1 is now **automatic by file presence** for supported non-Superstar collectible cards. If the canonical layered WebP exists, WWE Legacy uses it with live card-data overlays; if it does not, the existing flat/custom front remains the fallback. No manual card-ID activation registry is required.
- This means a deployed file such as `assets/cards/art/layered/moves/kevin-owens-stunner.webp` automatically takes priority over the old Stunner flat front.
- **Biel Toss — SS1-148** is a new shared SummerSlam Series 1 Common: C3/D5, Strength 1, Grapple, Front Control, grounds opponent.
- Oba Femi’s authored recommended deck uses **2 Biel Toss + 1 Body Slam**, and Biel Toss replaces Body Slam in his Lead Off 5.
- Kevin Owens retains the v0.13.30 Rare Trademark additions **Avalanche Fisherman’s Buster** and **KO’s Swanton Bomb**.
- Money in the Bank — Series 1 retains future shared **Trash Can to the Back**, **Chair to the Gut** and **Splash**.
- Pinned web-app update reliability remains active through `build.json`, no-store checks, same-origin cache-busted update navigation, active-match deferral and My Legacy update controls.
- Superstar chase remains **2% natural with one global 100-miss pity**. Completed-set packs cannot consume an armed pity.
- Secondary Superstar unlocks remain lean: Superstar + at most 1 Finisher / 1 Trademark / 1 Action; no shared filler, manufactured 60-page deck or Superstar-specific Entrance auto-grant.
- Special remains retired as a collectible type: **69 Actions / 0 Special-kind gameplay cards**.
- Expanded Achievements / Achievement Points / Career Score remains on hold and unimplemented.
- Profile schema remains **30**.

Season 1 release schedule remains: **RAW — Series 1 (5 Sep 2026)**, **Worlds Collide — Series 1 (26 Sep 2026)**, **Money in the Bank — Series 1 (10 Oct 2026)**, **SmackDown — Series 1 (31 Oct 2026)** and **Survivor Series — Series 1 (28 Nov 2026)**.

See `RELEASE-NOTES-v0.13.31.md` and `BUILD-CERTIFICATION.md`.
