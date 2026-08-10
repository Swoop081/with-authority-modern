# WWE Legacy: Collectible Card Game — v0.11.10
## Superstar Name + Official Set Identity Pass

### Superstar Art Studio
- Removed the wrestler-logo upload layer completely.
- Superstar fronts now use only:
  - set background/frame,
  - wrestler artwork,
  - official set logo where applicable,
  - Superstar name at the bottom.
- Added an automatic bold italic display-name treatment anchored along the bottom edge.
- The name treatment scales down automatically for longer names so the full ring name remains on one line.
- Set-specific name colours:
  - SummerSlam: bright white/chrome into orange with deep blue outline.
  - Hall of Fame: warm ivory into championship gold with navy outline.
  - Evolution: white into vivid magenta with deep violet outline.
  - Rewards / Final Boss: warm ivory into crimson with dark red outline.

### Official set logos
- Added a transparent WWE-hosted SummerSlam 2026 logo asset.
- Added a transparent WWE-hosted Hall of Fame logo asset.
- Added a transparent WWE-hosted WWE Evolution logo asset.
- SummerSlam, Hall of Fame and Evolution Superstar templates now automatically place the matching set logo at the top-right.
- Rewards / Final Boss remains intentionally logo-free for now because it is a reward identity rather than one of the three booster sets.
- Source URLs are documented alongside the local assets.

### Set branding across the game
- Booster pack wrappers now use the actual set logos for all three live sets.
- Face-down booster cards use the matching official set logo.
- Booster feature pages now show the matching set logo prominently alongside the Booster Vault presentation.
- Collection feature pages now show the matching set logo.
- Season 1 Featured Release tiles now carry the matching set mark.

### Editable SVG templates
- SummerSlam, Hall of Fame and Evolution SVG templates now include a top-right `SET_LOGO` layer and bottom `SUPERSTAR_NAME` layer.
- Rewards SVG keeps the bottom Superstar name treatment but no set logo.
- Removed the obsolete `SUPERSTAR_LOGO` placeholder.

### Build metadata
- Browser build label updated to v0.11.10.
- `package.json` version synchronized to 0.11.10.
