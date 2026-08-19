# WWE Legacy: Collectible Card Game

Current working build: **v0.13.48 — Home Season Title True Parity Hotfix**.

A mobile-first WWE collectible card game prototype with 60-page Superstar decks, Method Momentum, Adrenaline, Counters, Submissions, Pins, Deck Lab, Collection, boosters, Store, Seasons, Challenges, Live Events, Money in the Bank, King of the Ring and Championship Road.

## Current build
- **Safari card-art flicker fix:** collectible-card image candidates remain visually hidden until a real image has loaded, eliminating the brief broken-image **?** glyph seen on iPhone while a layered/custom path falls back.
- **Match cards load sooner:** cards in **Your Hand** and the **Play Pile** now request artwork eagerly instead of waiting for browser lazy-load timing.
- Duplicate legacy/custom fallback attempts are skipped when both candidates point to the same image path.
- Existing card-front precedence remains unchanged: layered/custom fronts still win when installed; missing fronts still resolve to the canonical rules/details fallback.
- **v0.13.46 Home title fix remains locked:** the Home **SEASON ONE** destination uses the same split-title typography component as **DECK LAB**, retaining white **SEASON** + cyan **ONE**.
- **No gameplay, balance, economy, content, collector, deck, reward, profile-schema or release-calendar changes.**
- All **v0.13.45 — Worlds Collide Mr. Iguana Completion Pass** content and behavior remain intact.
- Profile schema remains **31**.

Season 1 release schedule remains: **RAW — Series 1 (5 Sep 2026)**, **Worlds Collide — Series 1 (26 Sep 2026)**, **Money in the Bank — Series 1 (10 Oct 2026)**, **SmackDown — Series 1 (31 Oct 2026)** and **Survivor Series — Series 1 (28 Nov 2026)**.

See `RELEASE-NOTES-v0.13.48.md` and `BUILD-CERTIFICATION.md`.
