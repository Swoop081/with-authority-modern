# WWE Legacy v0.11.62 — Momentum Turn-Cycle Correction

Supersedes the v0.11.61 Control-sequence Momentum gate.

## Gameplay fix
- Momentum is now limited to one page per **turn / Move cycle**, not one per Control sequence.
- A successful connected Move advances the turn even when the same Superstar retains Control.
- The next Momentum page is therefore immediately eligible when the post-Move window closes and the next Move cycle begins.
- Specials, Actions, Supports, Managers and other utility do not refresh the Momentum allowance.
- Legal rhythm: `Momentum → Move → Momentum → Move`.
- Legal rhythm: `Momentum → Special → Move → Momentum`.
- Illegal rhythm: `Momentum → Special → Momentum`.
- Passing Control still begins a new turn normally and refreshes the turn-level allowance when that Superstar later receives a genuine new turn.
- Multi-Move Control-sequence combo tracking remains intact across these consecutive turns.

## UI / AI
- Hand messaging now reports that Momentum has been used for the current turn instead of the superseded Control-sequence wording.
- CPU Momentum decisions now use the same turn-level legality rule as the player.
