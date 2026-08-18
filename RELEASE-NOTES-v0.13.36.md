# WWE Legacy v0.13.36 — Super Pack Flow + Deck Ownership Hotfix

v0.13.36 supersedes v0.13.35 as the current working baseline.

## Mode-clear reward correction
- Normal, non-final victories still award **1 normal booster**.
- A victory that completes a full structured mode/tournament now awards **only the Super Pack** for that clear.
- The completing victory does **not** also award a normal Victory Booster and does **not** award direct UP.
- Applies to Daily/3-Day/Weekly Live Event tower clears, Money in the Bank, King of the Ring and Championship Road.
- King of the Ring retains its coronation / choose-one released-set Super Pack reward flow.
- Live Event detail/result copy now reflects the corrected total: a five-match tower produces **4 normal victory boosters + 1 Super Pack**, not five normal boosters plus the Super Pack.

## Super Pack final-card flow hotfix
- The Super Pack reveal now uses the explicit `next/summary` interaction path on the displayed card.
- Tapping **Card 5 of 5** always enters Pack Summary instead of leaving the opening screen stuck.
- Duplicate conversion timing is preserved; a converted final card advances after its UP conversion is credited.
- The same summary handler remains shared with standard and special booster flows.

## Deck Lab ownership integrity
- `Optimize Owned` and `Build Toward Recommended` now pass through a final hard inventory guard.
- Automatic rebuilds may only emit cards actually owned by the player, using combined Normal + Foil ownership for copy availability.
- Automatic builds still obey card copy caps, copy-family limits, Superstar restrictions and Method limits.
- `Build Toward Recommended` can continue showing unowned authored targets as goals, but cannot insert them into the playable draft.
- Deck Validity and Save continue to reject any unowned or over-owned pages.
- CPU/authored decks remain independent of player Collection ownership.

## Unchanged
- No gameplay-card balance, Superstar HP, authored-deck, collector-number, release-calendar, Super Pack odds, duplicate-UP values or profile-schema changes.
- v0.13.35 Hangman Armbar, Live Event release gating, layered-card priority, Play Pile reversal dedupe, 60% Pack Complete inspection, global paired-button layout and Trigger Response behavior remain intact.
