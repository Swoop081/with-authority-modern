# WWE Legacy: Collectible Card Game — v0.9.2

## Explicit Superstar restrictions on card backs
- Card rules backs now explicitly state Superstar legality.
- Superstar-specific cards display: SUPERSTAR RESTRICTION — Only playable by [Superstar].
- Linked Entrance cards display the linked Superstar explicitly.
- Manager cards with restricted rosters list the allowed Superstar(s).
- Shared cards explicitly state that they are playable by any Superstar.
- This information is visible while inspecting cards directly from booster reveals and the Collection.

## One-card-at-a-time booster reveal
- Booster packs no longer accumulate five large cards vertically/on the grid.
- Only the current card is displayed at full consistent size.
- Reveal Card 1, then tap Next Card to advance automatically to the next face-down card.
- Card 5 is the same size as Cards 1–4.
- Progress dots and Card X of 5 keep the player oriented.
- After revealing Card 5, the next action is View Pack Summary.

## Pack summary
- Added a dedicated pack-complete screen showing thumbnail cards for all five acquisitions.
- Cards owned for the first time show a prominent NEW badge.
- Foils and Superstar unlocks remain separately marked.
- NEW is based on first-ever ownership of that card identity, not merely a new Normal/Foil finish.

## Roster Construction / deck upgrades
- Deck-upgrade analysis now begins only after the player reviews the five-card pack summary.
- Review Roster & Deck Upgrades scans the five new pulls against unlocked Superstar decks.
- Suggestions identify which pulled card can improve which Superstar deck and explain why.
- Ask mode provides Upgrade Deck / Keep As-Is actions.
- Auto mode applies safe upgrades at this stage.
- Manual mode shows the suggestions without changing decks.
- Finish Pack returns to the pack-selection state.

## Certification
- 146/146 automated regression tests passing.
