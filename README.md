# WWE Legacy v0.14.04 — Razor Lead Off Sync + Tabled UI

This build supersedes **v0.14.03 — Razor Bulldog Replacement** and reconciles every currently outstanding running/tabled WWE Legacy change.

## Razor Lead Off save migration

- Razor’s authored Lead Off remains **Strength Momentum / Strike Momentum / Technical Momentum / Fallaway Slam / Punch**.
- The reported missing Technical page was caused by existing profiles retaining a valid older **saved Razor deck**, which took priority over the updated authored deck order.
- Profile schema advances to **39** and performs a one-time Razor saved-deck Lead Off sync for profiles from v0.14.03 and earlier.
- The migration moves the player’s existing saved copies of the five authored Lead Off pages into the first five slots. It preserves the exact card multiset, printing tiers and all other saved deck choices.
- Razor remains **6 Strength / 5 Strike / 1 Technical** Momentum; the sole Technical Momentum is therefore guaranteed in Lead Off and all remaining shuffled Momentum pages are Strength or Strike.
- Razor’s Abdominal Stretch and Razor’s Bulldog remain Technical 1. No Razor card balance values change in this build.

## Tabled presentation changes

- **Season 1 launch/continue promo:** uses the canonical John Cena collectible-card renderer so an installed `card-layered-superstar-john-cena.webp` (or the user’s flat Card Studio front) is shown as the actual physical reward card rather than rebuilding a lookalike from the menu render. The card and its image are centered in the left reward bay.
- **Home Season 1 tile:** enlarges the John Cena character render to match the visual presence of the neighboring Seth Rollins Deck Lab and Becky Lynch Challenges tiles while keeping Cena anchored on the right.
- **Pack Complete / five-card summary:** adds iPhone-safe vertical scrolling and responsive containment, keeps all five cards at one uniform size, gives each card a dedicated badge row, prevents rarity/printing/NEW chips from colliding with neighboring content, reserves space for helper copy, and keeps the NEXT CTA clear. Rules-fallback typography is tightened inside summary slots to reduce clipping.

## Packaging

The distributed ZIP intentionally **does not include the `assets/` directory**. Overlay it onto the current WWE Legacy installation that already contains the flat asset library and any Card Studio exports.

## Verification

- **823 tests discovered / 726 passed / 0 failed / 97 intentionally skipped historical contracts**, verified against the inherited v0.14.00 flat asset library.
- v0.14.04 targeted tests: **3/3 passed**.
- Validation: **76 Superstars / 76 decks / 706 gameplay cards / 0 orphans / 0 issues**.
- Collector ID audit: **782 cards / 782 manifest entries / 0 issues**.
- Flow audit: **76 Superstars / 0 issues**.
- Card-effect audit: **574 scoped gameplay cards / 389 effect-bearing cards / 0 issues**.
- Counter/submission-state audit: **706 gameplay cards / 517 Moves / 0 issues**.
- Inherited flat asset audit: **617 images / 310 installed gameplay-card fronts / 48 headshots / 39 menu portraits**.

See `BUILD-CERTIFICATION.md` for certification and `RELEASE-NOTES-v0.13.94.md` for the cumulative changelog.
