# WWE Legacy v0.11.22 — Move Requirement Fronts + Superstar Studio Filter

## Card Art Studio
- Added a set-aware **Superstar** dropdown covering all 25 playable Superstars.
- Added two Superstar scopes:
  - **Superstar-specific / linked cards only** — only genuinely Superstar-locked/linked fronts.
  - **Everything in current recommended deck** — also includes generic shared cards used by that Superstar.
- Studio search now uses only current card names, collector numbers and card types. Legacy internal IDs are deliberately excluded from search, preventing renamed generic cards such as `roman-clothesline` → **Running Clothesline** from being presented as Roman-specific.
- Stable internal IDs remain unchanged for engine, save, deck and artwork compatibility.

## Move fronts
- Every Move front now uses a fixed three-line footer layout:
  1. Move name
  2. `COST` / `DAM`
  3. Method requirements
- Requirement format: `◆ 2 STRENGTH   •   ◆ 1 TECHNICAL`.
- If a Move has no method requirement, line 3 stays visually blank; the name and COST/DAM rows never shift.
- The Studio snapshot now carries the live `requirements` object for all 261 active Move cards, including multi-method requirements.
- All other rules/effects/restrictions/rarity remain back-only.

## Compatibility
- No gameplay card IDs were renamed.
- No deck composition, card costs, damage or gameplay requirements were changed by this presentation pass.
