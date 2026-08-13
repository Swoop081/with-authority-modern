# WWE Legacy: Collectible Card Game — v0.11.69

## Premium Match Presentation + Gameplay Flow Fix

- Removed the post-move **End Offense** stall. A connected non-submission Move now automatically advances to the next turn while the attacking Superstar retains Control.
- Pin attempts now appear only at the **start of a fresh turn** when the opponent is at **60% HP or below** (amber/red). Playing Momentum or a Superstar Special closes that turn's pin window; committing a Move naturally closes it until the next turn.
- Repaired the core Adrenaline loop: every connected Move/Submission gives the attacker **+1 Adrenaline** and the defender **-1 Adrenaline**, with the live HUD reading that canonical state.
- Rebuilt the match HUD around dedicated **80% headshot / 20% HP** rows, compact single-row Momentum and Submission Damage, tappable headshots, and removed the redundant Exhibition / matchup title bar.
- Added dedicated HUD headshot asset paths at `assets/cards/art/custom/headshots/<superstar>.webp` with portrait fallback. Card Art Studio can now export a **HUD Headshot** crop at 1200×720.
- Superstar headshots open the full Superstar card in a ~60% screen-height modal; tap the card to flip and tap outside to close.
- Reworked the Play Pile into a horizontal current-exchange history with explicit **YOU / CPU + Superstar** ownership and result labels.
- Replaced repeated temporary move artwork with a neutral branded **ARTWORK PENDING** treatment until exact artwork is installed.
- Rebuilt card backs around canonical `rulesText`: strong title/type hierarchy, Cost/Damage stat blocks, an explicit Effect/Rules section, requirements, restrictions only when meaningful, and collector footer.
- Reduced heavy box chrome across the match screen for a more premium mobile-game presentation.
