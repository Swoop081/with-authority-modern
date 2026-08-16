# WWE Legacy v0.11.63 — Turn / Control Sequence State Audit

Supersedes v0.11.62 as the current working baseline.

## Core timing/state fixes
- A connected Move advances the global turn / Move cycle and refreshes the active wrestler’s per-turn Momentum, Action and Support allowance while preserving the current Control sequence.
- Actual Control changes now clear all Control-sequence-only memory, including previous connected Method/card, sequence move count, Strike/counter markers, queued sequence discounts, named damage buffs and sequence-only uncounterable/buff flags.
- A player regaining Control after truly losing it starts a new Control sequence even when a Special immediately returns Control to the same wrestler.

## Pin and counter paths
- Standing Moonsault, Chaos Theory and other kickout-retain-Control effects now advance the turn after the connected Move, so Momentum is immediately available for the next Move cycle while combo history remains valid.
- Offensive Counterattacks that connect now advance the turn even when Hammer in the Boot subsequently returns Control to Dominik.
- Hammer in the Boot after a defensive Counter starts a fresh Control sequence and turn for Dominik.
- Bloodline Rules now ends the countered Move cycle and refreshes the turn while Rock retains the same Control sequence.

## Card-effect correctness
- Method/name discounts and named damage buffs now persist through unrelated Moves during the same Control sequence and are consumed only by the matching Move.
- Gunther’s The Mat Is Sacred Action lock now persists across Control changes and clears only when the affected wrestler actually commits another Move.
- Seth Rollins’ The Architect wording is standardized to “next Move this turn.”
- Seth’s **The Visionary** Special now actually honors its printed “without advancing the turn” clause: a successful defensive Counter can open Seth’s offensive Control window without incrementing the turn or refreshing the turn-level Momentum allowance.
- Roman Reigns’ duplicated Turn 6 Entrance sentence is removed.
- Turn 5/6 delayed Entrances are tested against the corrected global turn advancement.
