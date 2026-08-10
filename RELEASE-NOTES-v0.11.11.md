# WWE Legacy: Collectible Card Game — v0.11.11

## Regression-suite reset and deck-health consistency

This build turns the inherited 33-test failure baseline into a clean, current certification suite without rolling the game back to obsolete pre-cleanup rules or card pools.

### Genuine fixes
- **Curb Stomp tactical identity:** explicitly restored to **Standing Above** so its Move Type matches its grounded-finisher role instead of being inferred as Leg Extended from the word “Stomp”.
- **Evolution copy caps:** IYO SKY and Paige each had six copies of one Momentum page once their fixed Lead Off page was counted. Their 55-page lists now remain functionally equivalent while respecting the five-copy cap.
- **Deck-health model:** the Deck Lab was still enforcing an obsolete utility-heavy deck shape. Floors, targets and UI target labels now describe the reviewed v0.11.x offense-forward 55-page architecture. All 25 recommended decks validate as healthy and Optimize Deck evaluates against the same targets shown in the UI.
- **Orientation diagnostic:** `tools/orientation-test.mjs` now has a safe default Superstar when discovered by `node --test`, so the full test command no longer crashes from a missing CLI argument.
- **Roster-count UI:** current Exhibition/Championship presentation derives the roster total dynamically rather than displaying an obsolete hard-coded 24.

### Stale regressions updated
The remaining inherited failures were obsolete fixtures or assertions: old Momentum totals, pre-cleanup set sizes, dormant card IDs, replaced Superstar abilities, old Manager effects/restrictions, old Stone Cold printings, previous submission pressure, outdated counter relationships, previous Final Boss signature membership and old Punk defensive-package counts. Tests now assert the current reviewed rules and active pools rather than resurrecting removed content.

### Certification
- **163 / 163 automated tests passing**.
- **25 / 25 recommended decks healthy**, 55 pages each, legal fixed Lead Off five, copy caps respected.
- **Full 25-Superstar certification:** 0 issues.
- **AI legal-pass audit:** 0 passes while a legal offensive Move was available.
- **10,000-match matrix:** 0 stalls, 46 time-limit draws.
- `npm run balance`: 7,500 matches, 0 stalls, 41 draws; seeded Superstar win rates 43.5%–59.2%.
- Active artwork audit remains **372 / 372** local-image coverage.

See `TEST-SUITE-AUDIT-v0.11.11.md` for the failure-by-failure disposition.
