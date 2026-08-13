# WWE Legacy v0.11.87 — First Match HUD + Headshot Framing Fix

- First-match coaching now renders as a true top-level, safe-area-aware overlay above the sticky HUD instead of being hidden behind it. The HUD is temporarily offset while the coach is visible.
- HUD Headshot Studio now uses a dedicated **1200 × 400 (3:1)** head-and-shoulders canvas with independent crop state and drag ranges.
- Oversized match HP numbers are lowered within each HUD panel so they sit above Momentum instead of competing with the iPhone Dynamic Island/status region.
- Existing profiles are migrated past first-match coaching; new profiles receive the guided first-match coach.
