# WWE Legacy: Collectible Card Game — v0.8.6

## Superstar unlock / collection integrity
- Unlocking a new Superstar no longer silently grants their complete 55-page recommended deck.
- The unlock grants real collection ownership of:
  - the Superstar card,
  - the linked Entrance,
  - the fixed five-card Lead Off package,
  - one copy of each Finisher and Trademark in that Superstar's recommended identity package.
- Existing booster-owned copies are preserved; the unlock only tops essential cards up to the required unlock quantity.
- Additional copies of Finishers, Trademarks and all other deck cards still come from boosters/rewards.

## Ownership-built deck
- On unlock, WWE Legacy constructs the best available deck from cards the player genuinely owns.
- The fixed Lead Off five remain first and locked.
- The builder prefers the tuned recommended list, then fills with other legal owned cards, prioritising offense and Momentum.
- No unowned cards are loaned or hidden inside the playable deck.
- If fewer than 55 legal owned pages are available, the Superstar remains unlocked but the deck is marked incomplete and Exhibition/Ladder/Championship play explains how many more owned pages are required.
- Subsequent booster pulls automatically rebuild incomplete decks until they reach 55 pages.
- Once a deck reaches 55 pages, automatic incomplete-deck rebuilding stops so player customisation is preserved.

## Certification
- 134/134 automated regression tests passing.
