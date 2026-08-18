# WWE Legacy v0.13.31 — Automatic Layered Front Fallback + Biel Toss Pass

## Automatic Layered v1 artwork priority
- Layered collectible fronts no longer require a per-card activation registry.
- Supported non-Superstar collectible cards automatically try their canonical Layered v1 path first, e.g. `assets/cards/art/layered/moves/<card-id>.webp`.
- If the layered plate loads, WWE Legacy displays it with the canonical live name, Cost, Damage, requirement, type and rarity overlays.
- If the layered plate is missing or fails to load, the card automatically falls back to its existing flat/custom front; if neither front exists, the established rules/details fallback remains.
- Card Art Studio copy now describes the automatic install/fallback workflow. The old `LAYERED_FRONT_IDS` manual activation registry is retired.
- This allows artwork such as `assets/cards/art/layered/moves/kevin-owens-stunner.webp` to take priority automatically whenever that file is present in the deployed build.

## Biel Toss
- Adds **Biel Toss — SS1-148**, a shared 1★ Common SummerSlam Series 1 Move.
- Cost 3 / Damage 5 / Strength 1 / Grapple / Front Control.
- On connect, grounds the opponent.
- Oba Femi’s recommended 60-page deck now uses **2 Biel Toss** and retains **1 Body Slam**.
- Biel Toss replaces Body Slam in Oba’s Lead Off 5.

## Compatibility
- Profile schema remains 30.
- No existing card IDs are changed.
- No gameplay/economy rules outside Biel Toss are changed.
- All v0.13.30 Kevin Owens Trademark and MITB future-content changes remain intact.
