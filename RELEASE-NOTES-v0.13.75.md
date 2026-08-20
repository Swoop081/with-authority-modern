# WWE Legacy v0.13.75 — Superstar Art Resolver Pass

## Summary
This pass fixes the mismatch between **Card Art Studio export filenames** and the live game's Superstar-art resolver. Card Studio is now the naming authority for layered Superstar fronts and HUD headshots across the entire roster, including RAW, New Generation and future authored sets.

All v0.13.74 RAW release/schedule changes remain intact.

## Included changes
- **Layered Superstar fronts now use Card Studio filenames**
  - Card Studio exports Superstar fronts using the canonical Superstar ID, e.g. `roxanne-perez.webp`.
  - The live layered resolver now looks for exactly:
    - `assets/cards/art/layered/superstars/roxanne-perez.webp`
    - not `assets/cards/art/layered/superstars/superstar-roxanne-perez.webp`.
  - The same rule automatically applies to every current and future Superstar.

- **HUD headshots now resolve every roster Superstar automatically**
  - The match HUD now attempts:
    - `assets/cards/art/custom/headshots/<superstar-id>.webp`
  - Resolution no longer depends on membership in the older `superstarArtwork` portrait registry.
  - If the custom headshot is missing, an existing legacy portrait is used when available before the generic placeholder.

- **Finished Superstar front resolution is no longer old-registry limited**
  - Flat Card Studio Superstar exports now resolve from:
    - `assets/cards/art/custom/superstars/<superstar-id>.webp`
  - This works even for newer roster additions that do not have an entry in the legacy portrait map.

- **Packaging contract documented and protected**
  - Added canonical filename documentation under layered Superstar fronts and HUD headshots.
  - Clean packaging continues to copy both asset trees without pruning them.

## Explicitly covered by regression tests
- Roxanne Perez
- Logan Paul
- Raquel Rodriguez
- Sol Ruca
- Bret Hart
- Shawn Michaels
- Razor Ramon
- Diesel
- every other Superstar in the 62-person authored roster

## Certification
- Automated regression suite: **701 / 701 passed**
- Structural validation: **62 Superstars / 62 decks / 562 gameplay cards / 0 orphans / 0 issues**
- Collector ID audit: **624 / 624 / 0 issues**
- Flow audit: **62 Superstars / 0 issues**
