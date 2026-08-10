# WWE Legacy: Collectible Card Game — v0.11.9
## Menu Refresh + Full-Art Superstar Template System

### Launch screen
- Removed the vertically centred launch composition that created excessive dead space above the WWE Legacy logo.
- WWE Legacy logo now sits high and centred as the first visual focus.
- Rebuilt the Season 1 / Final Boss section as a colourful promotional advertisement rather than a dark information panel.
- The Final Boss promotion now uses full-width red/gold campaign art treatment, The Rock portrait, stronger headline hierarchy and Tier 50 badge.
- Added an explicit splash-only topbar hide rule so the compact app header cannot steal launch-screen space.

### Superstar collectible fronts
- Superstar fronts are now **full-art cards**.
- The game does not overlay `SUPERSTAR`, `FOIL`, HP, rarity stars, name bars or stat bars on a Superstar front.
- The rules/ability back is preserved for gameplay/reference.
- Superstar WebPs are expected to contain the complete visual front: set background/frame + wrestler artwork + wrestler logo.
- Removed the foil sweep treatment from Superstar fronts while leaving existing ownership/economy data unchanged.

### Superstar Art Studio
- Added `tools/superstar-card-studio.html`.
- Four selectable template identities:
  - SummerSlam — Series 1
  - Hall of Fame — Series 1
  - Evolution — Series 1
  - Rewards / Season 1 Final Boss
- Load the current wrestler art or upload a replacement.
- Upload the wrestler's real-life transparent logo.
- Independent wrestler and logo positioning / scaling controls.
- Export finished WebP at 680×1000, 816×1200 or 1020×1500.
- Studio provides the suggested custom art path and `superstarArtOverrides` manifest entry.
- Added a Superstar Art Studio link under My Legacy / Profile.

### Source templates
Added editable 680×1000 SVG backgrounds under:
`assets/templates/superstar/`

These templates intentionally contain no HP, stars, foil text, card type labels or gameplay statistics.

### Build metadata
- Browser build label updated to v0.11.9.
- `package.json` version synchronized to 0.11.9.
