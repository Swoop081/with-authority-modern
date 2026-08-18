# WWE Legacy v0.13.2 — Once Too Often

## Universal anti-repeat Action
- Added **SS1-145 Once Too Often**, a 2★ Uncommon shared reactive Action.
- It is legal when the opponent plays a Move whose exact card ID already connected earlier in the same match.
- It reverses that repeated Move and transfers Control to the defender.
- It can answer repeated Finishers; it cannot answer counter-attacks.
- Match history is tracked by canonical card ID, so Foils and later player-facing renames do not break the rule.

## Decks and collection
- Every authored 60-page Superstar deck now starts with exactly **1× Once Too Often**, replacing one low-priority shared page outside Lead Off 5.
- The card uses the normal **5-copy deck/ownership cap**.
- New players receive one copy through their starter deck. Further copies are collectible from boosters.
- `universalBooster` cards can appear in any currently released set booster while keeping one collector identity.

## Existing profiles
- Profile schema advances to 29.
- Existing profiles receive one owned copy.
- Existing complete 60-page saved decks are safely migrated to include one copy without changing Lead Off 5 or Momentum.
- Incomplete/custom drafts are not forcibly rewritten.
- Live Event tower/Season/Ladder/Championship progression is unchanged. Individual MatchEngine state is not stored in the profile, so no in-progress match state is rewritten by migration.
