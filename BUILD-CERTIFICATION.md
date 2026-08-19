# WWE Legacy v0.13.55 — Build Certification

**Foil Power Chase Pass**

- **627/627 regression tests pass.**
- Validation: **58 Superstars / 58 decks / 533 gameplay cards / 0 orphans / 0 issues**.
- Flow audit: **58 Superstars / 0 issues**.
- Card-ID audit: **591/591 / 0 issues**; all collector manifests remain gap-free.
- Counter-state audit: **533 gameplay cards / 0 issues**; all 58 authored decks retain full accessible Counter-State and Submission-target coverage.
- Card-effect audit: **41 test Superstars / 416 gameplay cards / 259 effect-bearing cards / 0 issues**.
- Custom-front artwork audit remains **591 collector cards / 553 missing custom fronts** as expected while authored fallback presentation remains active.
- Profile schema remains **31**; no save-data shape change is required for independent standard-card finish caps.

## v0.13.55 certification focus
- Positive-Damage Foil Moves materialize at **Normal Damage +1** in Deck Lab, card inspection, pack presentation and live matches; the Foil application is idempotent and cannot stack.
- Zero-Damage Moves and non-Move cards receive no Damage bonus.
- Standard five-copy cards can now be owned as **5 Normal + 5 Foil**. Pulling a Foil no longer replaces a Normal copy.
- The gameplay deck limit remains **5 total copies per card identity**, so finish ownership expansion does not create 10-copy deck packages.
- Deck validation now checks Normal and Foil inventory separately, preventing a saved deck from claiming finishes the Collection does not own.
- AUTO BUILD, manual card additions and safe Deck Assistance prefer owned Foils; Foil recommendations for positive-Damage Moves explicitly communicate the +1 Damage upgrade.
- Booster guaranteed-progress logic respects the finish being pulled, so a guaranteed Foil can progress the Foil collection independently of the Normal 5-copy cap.
- Overflow conversion remains rarity-based and otherwise unchanged.
- The Rulebook now documents the restored Foil gameplay rule, separate finish ownership caps, and unchanged five-copy deck identity limit.
- All v0.13.54 iPhone Screenshot Consolidation changes and retained v0.13.47–v0.13.53 fixes remain active.
