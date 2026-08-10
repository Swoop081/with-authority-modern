# WWE Legacy v0.8.5

## Lead Off opening-hand redesign

- Entrance cards are now permanently attached to the Superstar and resolve automatically in Pre-Match outside the 55-page playable deck.
- Every Superstar has a fully curated five-card playable Lead Off hand: normally two Momentum pages and three Moves/counters.
- The old random fifth opening card has been removed.
- Neither wrestler draws a random page on their first Control turn; normal draws begin after their first Control opportunity.
- Lead Off grants a one-time -1 Total Momentum requirement to the Superstar's first cost-1/2 Move. Printed method requirements are unchanged.
- CPU Momentum selection now prioritizes the Momentum page that unlocks an immediate Move.
- All 24 Superstars are regression-tested to play Momentum then have a legal Move immediately on first Control.

## Balance follow-up

- Small HP corrections were applied after the deterministic openings shifted matchup balance.
- Full 6,912-match matrix: 24.86 average turns, 3.24 loser HP, 0 stalls, 103 time-limit draws.
- Seeded Superstar win-rate range: 44.3%–56.3%.

## Preserved v0.8.4 systems

- 0-HP Critical Exhaustion.
- Generic offensive counter-attacks and counter-to-counter windows.
- Submission Finisher/Trademark maintenance while a legal ditch exists.
- Pass-reason telemetry.
- No ringside-only Moves in recommended starter decks.
