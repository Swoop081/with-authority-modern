# v0.11.24 — Phantom Exclusive Cleanup

- Removed **153 dormant Superstar-specific Move definitions** that were no longer in any active deck/collection.
- Removed the retired Kevin Owens and Becky Lynch `Running Forearm` definitions rather than reactivating them.
- Removed the unused legacy `tacticalOffense` / `buildDeck` construction path from `decks.js`.
- Added a regression invariant preventing dormant Superstar-specific Moves from remaining in production data.
- Active pool, current decks, collector numbers and Card Art Studio selections remain unchanged.
