# WWE Legacy — Source Consistency Audit v0.11.24

## Why this pass happened
Kevin Owens' and Becky Lynch's retired Superstar-specific `Running Forearm` definitions still existed in production source even though the active game uses the shared `Running Forearm`. They were not collectibles and therefore did not appear in Card Art Studio, creating the impression that Studio was missing cards.

## Audit result
The same pattern existed beyond those two cards.

- Dormant Superstar-specific Move definitions before cleanup: **153**
- Dormant Superstar-specific Move definitions after cleanup: **0**
- Active collectibles changed: **0**
- Deck composition changed: **0**
- Collector numbers changed: **0**
- Card Art Studio card choices changed: **0**

All 153 retired Superstar-specific Move definitions were removed from production data. This includes the old Kevin Owens and Becky Lynch `Running Forearm` variants and other superseded/unused exclusive Move definitions.

The older unused `tacticalOffense` / `buildDeck` path was also removed from `decks.js`; all current decks already use the reviewed 55-card deck definitions, so that code was dead and still referenced retired card definitions.

## Active-pool invariants
Production now enforces regression tests so that:

- every Superstar-specific Move definition in source belongs to the active collectible pool;
- every active Superstar-specific playable card is actually used by its owning Superstar;
- no active Superstar-specific playable card is used by the wrong Superstar.

Audit result: **0** wrong-owner cards and **0** active restricted cards orphaned from their owner deck.

## What was intentionally preserved
Shared/general historical definitions that are outside the active pool were not part of this exclusive-card cleanup. **150** such shared/general source definitions remain dormant; they are not in boosters, decks, the collection, or Card Art Studio. They do not create the same hidden-Superstar-exclusive ambiguity and can be pruned separately if we want production source to contain only active collectibles.
