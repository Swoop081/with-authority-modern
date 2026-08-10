# WWE Legacy v0.11.0 — Hall of Fame Series 1 First Simulation Pass

## Compiled roster
Hulk Hogan, André the Giant, Randy Savage, Ultimate Warrior, Stone Cold Steve Austin, The Undertaker, Mankind, Kane.

## Manager Zone
- Bobby "The Brain" Heenan — André the Giant.
- Miss Elizabeth — Randy Savage.
- Paul Bearer — The Undertaker only.
- One active Manager at a time.
- If a Manager is in the fixed opening five, it is moved to the Manager Zone and replaced so the player still starts with five playable pages.
- Manager abilities exhaust after their once-per-match use.

## Deck legality certification
- 55 playable pages for all eight starters.
- Exact five-card Lead Off packages linked to Superstar cards.
- No card appears more than five times.
- Zero hard-unplayable Moves caused by unsupported Momentum methods.
- All eight starters can play Momentum and then immediate Lead Off offense.
- Kane has no Paul Bearer card.

## Hall of Fame-only simulation
1,920 CPU-vs-CPU matches, ordered matchups including mirrors.

Average turns: 26.24
Passes per match: 6.96
Counter rate: 11.7%
AutoCounters: 5
Pin rate: 79.1%
Submission rate: 20.3%
Average winner HP: 36.79
Average loser HP: 5.77
Stalls: 0
Draws: 11

## Win rates
- André the Giant: 71.0%
- Mankind: 57.3%
- Stone Cold Steve Austin: 51.5%
- Ultimate Warrior: 47.3%
- Kane: 45.8%
- Hulk Hogan: 44.8%
- The Undertaker: 41.5%
- Randy Savage: 38.5%

## First-pass finding
The card identities and method legality are functioning, but the set is not internally balanced enough to cross-test against SummerSlam yet. André is a clear overperformer; Savage and Undertaker are underperforming. Austin's Kick-to-the-Gut -> Stunner and Kane's Chokeslam -> Tombstone chains were corrected so their searched Finishers are actually usable. Savage's 3-Agility finisher gate was reduced to the 2 Agility + 1 Strike fallback identified during design testing.
