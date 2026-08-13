# WWE Legacy v0.99.0 — HUD Headshot Studio Fix

- HUD Headshot export now uses its own **720 × 960 portrait canvas**, replacing the incorrect 1200 × 720 horizontal card-derived surface.
- Headshot crop/zoom/position state is independent from Finished Card Front positioning, so switching modes no longer carries the card crop into the HUD portrait.
- Drag math now uses each export target's own coordinate system instead of hard-coded 680 × 1000 card dimensions.
- The preview wrapper changes aspect ratio with the selected export target so the Studio accurately previews the final portrait.
- HUD Headshot export preserves transparent canvas output for transparent wrestler cutouts.
- Existing dedicated `assets/cards/art/custom/headshots/<superstar>.webp` install path remains unchanged.
