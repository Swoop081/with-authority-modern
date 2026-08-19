# WWE Legacy: Collectible Card Game

Current working build: **v0.13.50 — Season Fixed Viewport Hotfix**.

A mobile-first WWE collectible card game prototype with 60-page Superstar decks, Method Momentum, Adrenaline, Counters, Submissions, Pins, Deck Lab, Collection, boosters, Store, Seasons, Challenges, Live Events, Money in the Bank, King of the Ring and Championship Road.

## Current build
- **Season viewport is truly fixed:** the full Season One / Rock hero, three command tiles, and free-booster strip are pinned between the global top band and bottom navigation and cannot be moved off screen by Safari document scroll restoration.
- **Only the lower Season road scrolls:** the 100-tier reward road (plus retained release-road content) owns vertical scrolling; its road label moves with the scroller.
- **Safari re-entry safeguard:** entering/rerendering Season explicitly clears stale document scroll offsets before current-tier auto-focus runs inside the road scroller.
- **v0.13.48 Home title parity remains locked:** Home **SEASON ONE** uses the same typography component as **DECK LAB** while retaining white/cyan Season colours.
- **v0.13.47 card-art flicker protection remains locked:** failed/loading card-art candidates do not expose Safari's broken-image **?** glyph.
- **No gameplay, balance, economy, content, collector, deck, reward, profile-schema or release-calendar changes.**
- All **v0.13.45 — Worlds Collide Mr. Iguana Completion Pass** content and behavior remain intact.
- Profile schema remains **31**.

Season 1 release schedule remains: **RAW — Series 1 (5 Sep 2026)**, **Worlds Collide — Series 1 (26 Sep 2026)**, **Money in the Bank — Series 1 (10 Oct 2026)**, **SmackDown — Series 1 (31 Oct 2026)** and **Survivor Series — Series 1 (28 Nov 2026)**.

See `RELEASE-NOTES-v0.13.50.md` and `BUILD-CERTIFICATION.md`.
