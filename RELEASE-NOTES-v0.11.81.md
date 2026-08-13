# WWE Legacy CCG v0.11.81 — Season 1 Balance Pass 2

Second targeted Season 1 tuning pass using the v0.11.80 3,280-match round robin as the directional baseline. This pass deliberately avoids changing locked durability values or core recent SmackDown identities simply to chase heuristic CPU percentages.

## High-end trims
- André the Giant — Giant’s Reach now discounts the next Strength Move on the first qualifying Strike rather than twice.
- El Grande Americano — Masked Opportunist now pays out on the first 2 Method-switch sequences rather than 3; the stronger all-Method Entrance remains intact.
- Dominik Mysterio — Dirty Dom now begins with Agility + Strength Momentum rather than also front-loading Technical.
- Raquel Rodriguez — keeps her locked 53 HP / Tejana Bomb package, but her recommended deck curve is softened by replacing two heavier repeat slots with Fireman’s Carry and Running Clothesline.

## Catch-up tuning
- Rhea Ripley — This Is My Brutality now begins with +1 Strength and +1 Strike Momentum plus +1 Adrenaline, helping her dual-method identity come online immediately.
- Alexa Bliss — The Goddess now begins with +1 Agility and +1 Technical Momentum plus +1 Adrenaline.
- Sol Ruca — Daredevil Instincts’ Agility counter-attack bonus increases from +2 to +3 Damage while retaining the locked 48 HP.
- CM Punk — Pipe Bomb now also grants +1 Adrenaline on each of its first 2 successful-Counter triggers.
- Becky Lynch — Dis-arm-her is now correctly implemented as an Arm Submission (Pressure 5), and Manhandle Slam carries Pin Bonus +4.
- Selected underperforming legacy finishers now carry Pin Bonus +4: Curb Stomp, G.T.S., Kevin Owens’ Stunner, Fall From Grace, Riptide and Oblivion.

## Tiffany Stratton implementation correction
- Tiffany Epiphany now genuinely searches the best matching Strength/Agility Move for the opponent’s current posture rather than simply taking the first card of each Method found in deck order.
- Tiffany’s recommended deck carries a fourth Handspring Back Elbow to improve access to Prettiest Moonsault Ever without changing her locked Superstar/Finisher design.

## Simulation signal
The post-pass directional 3,280-match benchmark still places The Rock intentionally clear at 81.3%. The regular top cluster is Raquel 75.6%, André 63.8%, EGA 63.1%, Roman/Gunther 61.3%, Warrior/Dominik 60.0%. Rhea rises to 48.8% and Alexa to 56.9%.

Tiffany remains a low heuristic-AI result despite the search fix; her locked deck is highly sequence/position dependent and should be judged with human playtesting rather than automatically rewritten around the simplistic CPU decision model. Becky improves only modestly in AI simulation, but her submission/finisher rules are now mechanically correct.

## Validation
- 41 Superstars / 41 complete 55-page decks.
- 350 gameplay cards / 391 collectibles.
- 0 orphan gameplay cards.
- 47/47 automated tests pass.
- Full flow, collector-ID and rebuild validation clean.
