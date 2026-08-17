# WWE Legacy v0.12.69 — Package Hygiene Pass

This release is a packaging and repository-hygiene pass on top of v0.12.68. Gameplay, balance, card data, progression, booster behavior, and presentation are unchanged.

## Shipped package cleanup
- Rebuilt the release from an explicit allowlist instead of zipping the entire historical working directory.
- Removed hundreds of obsolete root-level audit, simulation, validation, flow, card-ID, and diagnostic artifacts from the shipped package.
- Removed all historical release-note files from the shipped package; only the current release notes remain.
- Added `BUILD-CERTIFICATION.md` as the single compact current certification record.
- Removed confirmed-dead duplicate/legacy image assets that are no longer referenced by the live UI or Card Art Studio paths.
- Removed unused legacy artwork-root constants associated with the retired image paths.
- Added `npm run package-clean` / `tools/package-clean.mjs` so future packages use the same clean allowlist automatically and fail if historical root debris leaks back in.

## No gameplay change
v0.12.68 rules, HP values, economy, booster rarity, Superstar pity, card fronts, foil treatment, pack flow, and Final Boss presentation remain unchanged.
