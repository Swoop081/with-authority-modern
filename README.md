# WWE Legacy: Collectible Card Game — v0.11.65

Internal Season 1 development build containing the current **35-Superstar** pool through the second playable **Money in the Bank — Series 1** Superstar, LA Knight.

Current post-launch subset status:
- Raw — Series 1: complete (4 Superstars)
- Worlds Collide — Series 1: complete (4 Superstars)
- Money in the Bank — Series 1: Jey Uso and LA Knight playable; Alexa Bliss and Finn Bálor reserved next

This build preserves the v0.11.63 turn / Control-sequence state model: a connected Move advances the turn and refreshes per-turn Momentum while retained Control preserves sequence-only combo state; actual Control changes clear sequence state.

Money in the Bank retains its dedicated Card Art Studio front and randomized Tonight’s Main Event presentation branding.

Run `npm test`, `npm run validate`, `npm run card-ids`, `npm run flow`, `npm run economy`, `npm run art`, and `npm run balance` for release validation.
