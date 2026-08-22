# WWE Legacy v0.13.95 — Asset Recovery + Flat Image Directory

## Scope
Built from v0.13.94 gameplay/UI plus the original user-supplied GitHub `export.zip` image library. This release repairs the missing-art packaging regression and completes the requested single-directory image migration.

## Asset certification
- All runtime image files are stored directly in `assets/images/`.
- 616 retained image files are packaged after removing known retired/dead legacy assets.
- 310 gameplay-card fronts currently resolve to an installed image: 158 layered plates + 152 flat/custom fronts.
- 48 recovered Superstar HUD headshots are packaged.
- 38 Superstar menu/profile images resolve from the recovered/current library.
- Runtime JS/CSS/HTML/manifest files contain no live references to the retired `assets/cards/art`, `assets/art`, `assets/branding`, `assets/ui`, `assets/icons` or `assets/templates` image roots.
- Missing card art continues to use the canonical rules/details fallback.

## UI correction
- Welcome Superstar onboarding owns the iPhone viewport and no longer receives the persistent app-chrome top offset that caused the large black gap.

## Verification
- Automated suite: 794 discovered / 702 passed / 0 failed / 92 intentionally skipped historical contracts.
- v0.13.95 flat-asset contract: 4/4 passed.
- Validation: 76 Superstars / 76 decks / 706 gameplay cards / 0 orphans / 0 issues.
- Collector ID audit: 782/782 / 0 issues.
- Flow audit: 76/76 / 0 issues.
- Card-effect audit: 0 issues.
- Counter/submission-state audit: 0 issues.
- Flat asset audit: 616 image files / 310 installed gameplay-card fronts / 48 headshots / no stale runtime image roots.
