# WWE Legacy: Collectible Card Game v0.11.44 — Hall of Fame Native Hooks

This pass moves the newly reviewed Hall of Fame Series 1 identity mechanics out of simulation-only approximations and into the real MatchEngine.

## Native Hall of Fame mechanics
- Bobby "The Brain" Heenan: once per match after the managed wrestler's non-Finisher Move is Countered, draw 1 and regain Control after the response resolves. He no longer recovers the Move or interferes with pins.
- Hulk Hogan — Hulk Up: on gaining Control at 50% HP or less, clear Stun, gain +2 Adrenaline, and protect the next Hogan's Big Boot in that Control sequence from Move counters. Counter Any / Auto Counter responses remain legal.
- Kane — Rise From the Flames: once per match ignore a Stun that would be applied and gain +1 Adrenaline.
- Mankind — Mr. Socko: when gaining Control against a grounded opponent, draw 1 and reduce the next Mandible Claw in that Control sequence by 2 Cost.
- Ultimate Warrior — Shake the Ropes: after losing Control at 50% HP or less, gain +2 Adrenaline; clear Stun the next time Warrior gains Control.
- Randy Savage — Oh Yeah!: after a successful Counter, the next Agility Move in that Control sequence costs 2 less.
- André the Giant — Nobody Slams André: once per match a Strength Move that would ground André still deals damage, but André remains standing and gains +1 Adrenaline.
- Undertaker — Sit Up: after a natural kickout, gain +1 Adrenaline and take the normal post-kickout Control.
- Miss Elizabeth: once per match when Savage loses Control, draw 1 and gain +1 Adrenaline.

## Signature sequence hooks
- Stone Cold: Kick to the Gut protects Stone Cold Stunner from all Counters only on Austin's immediately following turn.
- Hogan's Big Boot directly searches/draws Atomic Leg Drop on connect.
- Warrior's Gorilla Press Slam directly searches/draws Warrior Splash on connect.
- Undertaker's Snake Eyes gives the next Running Big Boot in the same Control sequence +2 Damage.
- Kane's Two-Handed Choke Lift gives the next Chokeslam From Hell in the same Control sequence +1 Damage.

## Finalized passive hooks
- Undertaker — Lord of Darkness: survive one lethal Move at 1 HP with no obsolete bonus draw/Adrenaline.
- Mankind — Deranged Resilience: reduce the first two incoming 8+ Damage Moves by 2.
- Ultimate Warrior — Feel the Power: draw on the second connected Move in a Control sequence, up to twice per match.
- Randy Savage — Macho Madness: Strike into Agility in the same Control sequence draws, up to twice per match.
- André — Giant's Reach: first two connected Strike Moves discount the next Strength Move in that Control sequence by 1.
- Kane — Big Red Machine uses the reviewed first-two 8+ Damage connection reward.

## Engine integration fixes
- CPU counter selection understands "cannot be Countered by a Move" and will not attempt an illegal Move counter against Hulk Up's protected Big Boot.
- Deck Health now counts guaranteed pre-match Entrance Momentum when validating whether a deck can satisfy a tertiary Method requirement (for example Kane's Entrance-supplied Agility).
- Full-roster certification now uses that same Entrance-aware Method supply, eliminating validator drift for tertiary Entrance Momentum.
- Card Art Studio frozen data was synchronized with the live reviewed Hall of Fame card requirements and values.
- Added a dedicated Hall of Fame native-hook regression suite.

## Scope
- No balance tuning was performed in this pass.
- This is not the final Hall of Fame starter-deck/card-pool rebase or collector-number cleanup; that remains part of the full 26-Superstar audit.
- Evolution deck design was not changed in this pass.
