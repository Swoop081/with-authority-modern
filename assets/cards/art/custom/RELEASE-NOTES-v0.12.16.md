# WWE Legacy: Collectible Card Game — v0.12.16

## Runtime Match-Flow Hotfix

v0.12.16 is a focused correction built directly from the packaged v0.12.15 baseline using the Roman Reigns vs Kane iPhone reproduction supplied during testing.

### Fixed: Cost legality now counts Momentum + Attitude
- Numeric card Cost is checked against **all permanent Method Momentum + current Attitude**.
- Printed Method requirements remain separate gates and still require the matching Method Momentum.
- Normal card play does not consume Method Momentum or Attitude.
- Move, Counter and Action legality all use the corrected total Cost capacity.
- Disabled-card copy now says `Need X Momentum + Attitude` instead of incorrectly implying that Method Momentum alone pays Cost.
- Regression coverage reproduces the Turn 6 Roman state: Strength 2 + Strike 2 + Attitude 5 gives Cost capacity 9, making Cost 5/6 cards legal when their Method requirements are met.

### Fixed: retained-Control turns now draw for both Superstars
- Turn 1 still begins from the Lead Off 5 with no automatic draw.
- Every global turn advance after Turn 1 now draws **1 page for each Superstar**.
- This fixes the confirmed Turn 8–12 bug where Roman stayed at `3 hand / 46 deck / 6 discard` while Kane retained Control and attacked repeatedly.
- Control changes do not add a second separate draw; the draw is owned by the single global turn-advance phase.

### Fixed: successful pins cannot skip the referee count
- The engine may resolve the pin result immediately, but the UI now blocks Match Complete while the finish spectacle is active.
- A successful pin must visibly play **1 → 2 → 3** before the Victory/Defeat screen can render.
- Match rewards/progression handling is also deferred until the finish presentation completes.
- Failed pins retain the existing kick-out branch and transfer Control.

## Certification
- Automated tests: **105/105 pass**.
- Flow audit: **50 Superstars / 0 issues**.
- Rebuild validation: **50 decks / 422 gameplay cards / 0 orphans / 0 issues**.
- Collector ID audit: **472/472 clean**.
- Economy simulation: **60 packs / 300 cards / 0 Entrance leaks / 0 foil-first failures**.
- Balance simulation: **2,450 matches / 0 stalls / 15.0 average turns**.
- Extended balance: **4,900 matches / 0 stalls / 14.96 average turns**.
- Dead-turn audit after the two engine fixes: **1.00 pass decision per match; 0/2,450 matches with a 4+ consecutive-pass streak; maximum streak 3**.

The corrected draw/Cost rules materially accelerate matches compared with v0.12.15, so roster win-rate tuning remains a separate balance task rather than being mixed into this runtime hotfix.
