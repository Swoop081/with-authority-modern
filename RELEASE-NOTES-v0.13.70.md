# WWE Legacy v0.13.70 — Main Event Hero Positioning Pass

Frozen 20 August 2026.

## Main Event / pre-match viewport repair
- Removed the returning empty black band above the television-style matchup screen.
- Root cause fixed at the shared chrome-spacing rule: `matchup` is now excluded from main-content padding reserved for the fixed global status bar, because the status bar is intentionally hidden on this screen.
- The event/show background now begins at the top of the viewport rather than below an invisible chrome reservation.

## SummerSlam show-logo hierarchy
- The SummerSlam logo retains the existing matchup size: 112px desktop/tablet and 100px on phones.
- The full hero stack is positioned in the upper third using safe-area-aware top spacing rather than a large blank band.
- Removed the negative margin between the show logo and matchup heading.
- `TONIGHT’S` now occupies its own separated line below the logo and cannot overlay/crop into the SummerSlam artwork.
- `MAIN EVENT`, the two Superstar cards, `VS`, and `START MATCH` retain the established presentation hierarchy.

## Scope
This is a presentation-only repair. Gameplay, card data, balance, decks, collector numbering, pack odds, economy, progression, rewards and release gating are unchanged from v0.13.69.
