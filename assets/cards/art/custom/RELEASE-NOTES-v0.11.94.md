# WWE Legacy v0.11.94 — Canonical Health Bands + Pin Threshold Correction

Supersedes v0.11.93 as the current development baseline.

## Canonical health bands
- **Green:** 65–100% HP
- **Amber:** 25–64% HP
- **Red:** 0–24% HP
- The live HUD HP colour now uses these exact bands.
- Health-band constants and helpers are centralized in `js/engine/health.js` so UI, rules, AI and simulations cannot drift independently.

## Health-only pins
- Green wrestlers cannot be pinned.
- Amber opens the cover window, but health-only pin chance remains deliberately tiny at **1–3%**.
- Red is the true finishing phase: chance starts at **15%** around 24% HP and scales to **90%** at 0 HP.
- CPU opponents only choose Attempt Pin while the defender is in Red.
- The global Pin Bonus removal introduced in v0.11.93 remains unchanged.

## Retained work
- v0.11.92 iPhone safe-area, HUD, Play Pile and show-themed control improvements remain intact.
- v0.11.91 Chelsea Green / Running Knees to the Back remains intact.
