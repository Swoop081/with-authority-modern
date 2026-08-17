# WWE Legacy: Collectible Card Game — v0.12.67
## Hero Anchor & Containment Repair

This presentation-only hotfix corrects the oversized/cropped hero regressions introduced by v0.12.66. All v0.12.65 economy, booster, foil, pack-flow, inspection and HP-balance changes remain unchanged.

### Launch / Final Boss
- Re-anchors the dedicated Final Boss Rock render inside the Season 1 launch promotion.
- Rock remains substantially larger than the old small-corner treatment, but returns to `object-fit: contain` rather than the destructive cover crop.
- The promo itself clips overflow, while the Rock art may extend across its art column behind the higher-z-index copy, preserving the full upper-body silhouette and arms.

### Climb the Ladder + Championship Road
- Removes the near-2x transform that caused Superstar photography to swallow the header UI.
- Keeps the header portrait larger than the pre-hotfix baseline at a controlled ~1.3x scale.
- Moves the portrait zone farther right and anchors from the bottom/right so the title, subtitle, era selector and summary row remain visually clear.

### Scope
- Presentation-only. No gameplay, card data, deck, economy, Season reward, booster probability, ownership or HP changes.
