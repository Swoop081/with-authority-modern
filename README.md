# WWE Legacy: Collectible Card Game

Current working build: **v0.13.46 — Home Season Title Consistency Hotfix**.

A mobile-first WWE collectible card game prototype with 60-page Superstar decks, Method Momentum, Adrenaline, Counters, Submissions, Pins, Deck Lab, Collection, boosters, Store, Seasons, Challenges, Live Events, Money in the Bank, King of the Ring and Championship Road.

## Current build
- **Home Season title consistency:** the **SEASON ONE** title card above Deck Lab on the Home hub now uses the exact same split-title component, font treatment, size, line height, spacing and iPhone breakpoint as **DECK LAB** and the other Home destination headers.
- **Season colours are retained:** **SEASON** remains white and **ONE** remains cyan. Only the typography/component implementation changes.
- The previous independent `season-home-title` approximation is no longer used by the Home Season card, preventing later Season-specific CSS from shrinking or restyling it differently from Deck Lab.
- **No Season page redesign:** the Season tab hero, reward road, countdown/free-booster controls and purple Season presentation remain unchanged.
- **No gameplay, balance, economy, content, collector, deck, reward, profile-schema or release-calendar changes.**
- All **v0.13.45 — Worlds Collide Mr. Iguana Completion Pass** content and behavior remain intact, including the completed 8-Superstar / 64-card Worlds Collide Series 1 authored structure and the Spanish Fly / Vikingo corrections.
- Profile schema remains **31**.

Season 1 release schedule remains: **RAW — Series 1 (5 Sep 2026)**, **Worlds Collide — Series 1 (26 Sep 2026)**, **Money in the Bank — Series 1 (10 Oct 2026)**, **SmackDown — Series 1 (31 Oct 2026)** and **Survivor Series — Series 1 (28 Nov 2026)**.

See `RELEASE-NOTES-v0.13.46.md` and `BUILD-CERTIFICATION.md`.
