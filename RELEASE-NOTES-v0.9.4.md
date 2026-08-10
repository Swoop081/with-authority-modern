# WWE Legacy: Collectible Card Game — v0.9.4

## Compact match HUD
- Rebuilt the match HUD into a compact two-wrestler status strip inspired by the original With Authority-style information density.
- Each wrestler now shows portrait, name, current/max HP, total Momentum, six method values, location/posture and submission threshold in a much smaller footprint.
- Removed large nickname, ability/support/manager blocks from the always-visible match HUD to keep the ring state and hand closer to the top of the screen.
- Match mode, matchup, turn number and ring/posture state remain visible in compact strips.
- Mobile Play Pile size is also reduced so it no longer dominates the vertical viewport.

## Horizontal hand
- The player's hand is now a horizontal swipe/scroll carousel instead of a vertical two-column list.
- Cards keep a consistent tactical size and use scroll snapping for easy one-card-at-a-time browsing on iPhone.
- Play controls stay attached below each card.
- Original hand indexes are preserved internally even when the display order changes, so playing a sorted card still commits the correct page.

## Dynamic tactical sorting
- Before Momentum is played for the current turn:
  1. currently playable Momentum appears first;
  2. other currently playable cards appear next;
  3. non-playable non-Momentum follows;
  4. non-playable Momentum is last.
- After a Momentum page has been played that turn, all remaining Momentum is moved to the rear of the hand display.
- On the next turn, Momentum becomes eligible for front-of-hand priority again.
- Counter / pin-response windows continue to sort genuinely playable response cards ahead of locked cards.

## Certification
- 153/153 automated regression tests passing.
