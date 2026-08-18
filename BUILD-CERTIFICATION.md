# WWE Legacy v0.13.2 — Build Certification

- Regression tests: **411/411 pass**
- Validation: **50 Superstars / 50 decks / 457 gameplay cards / 0 orphans / 0 issues**
- Flow audit: **50 Superstars / 0 issues**
- Card-ID audit: **507/507 / 0 issues**
- Counter-state audit: **457 gameplay cards / 328 Moves / 0 issues**
- Economy smoke audit: **60 packs / 300 cards / 0 duplicate Entrance pulls / 0 foil-first failures**
- First-25 balance smoke after universal anti-repeat insertion: **6,000 matches / 0 stalls / 27.44 average turns / 5,473 pinfalls / 527 submissions**
- Art audit: **507 collector cards / 470 unfinished custom fronts** (known presentation backlog; canonical rules-back fallback remains active)

## v0.13.2 — Once Too Often

- Adds **SS1-145 Once Too Often**, a shared **2★ Uncommon Reactive Action**.
- It becomes legal during the Counter window only when the opponent is playing the exact same canonical Move card that has already connected earlier in that match.
- Playing it reverses the repeated Move, prevents its new Damage/effects, discards Once Too Often and transfers Control to the defender.
- It can answer repeated Finishers and cannot answer counter-attacks.
- Match history is tracked by card ID, so Foil finish and player-facing renames do not affect the repeat check.
- Every authored 60-page deck starts with exactly **1× Once Too Often**, replacing a low-priority shared page outside Lead Off 5.
- The card uses the normal **5-copy ownership/deck cap**; players may remove the starter copy or collect and run additional copies.
- Only the first starter/full-deck grant awards a copy. Additional copies are intended to come from boosters.
- `universalBooster` pooling lets Once Too Often appear in any currently released set booster while retaining its single SS1 collector identity.
- Profile schema advances to **29**. Existing profiles receive one copy, and complete existing 60-page saved decks are migrated after historical deck migrations so old recommended fingerprints still resolve correctly.
- Existing incomplete/custom drafts are not forcibly rewritten. Lead Off 5, Momentum, Finishers, Trademarks and Superstar-exclusive cards are protected by the safe replacement selector.
- Live Event tower, Ladder, Championship Road and Season progress are unchanged. WWE Legacy does not serialize individual MatchEngine state into the profile, so the migration only affects decks used when a new bout is created.
- Layered Card Front v1 remains unchanged: existing flat fronts still receive no live overlays unless explicitly opted into layered mode.
