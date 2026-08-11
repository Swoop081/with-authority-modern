# WWE Legacy v0.11.37 — Full-Screen Booster Opening

## Booster Vault focus
- Removed the Collection, Exhibition, Climb the Ladder, Championship Road and Deck Builder shortcut buttons from the Booster Vault hero.
- Kept the three live set selectors on one compact row.
- Kept Standard, Ladder and Championship pack buttons on one compact row.
- Moved the pack itself directly below the pack buttons, ahead of secondary statistics and Deck Assistance.
- Moved pack/opened/Superstar statistics and Deck Assistance below the pack presentation.

## Full-screen pack flow
- Selecting a pack now opens a dedicated full-screen pack layer above the Booster Vault.
- The persistent bottom hub is hidden while the pack is being opened/revealed/reviewed.
- Opening animation, one-at-a-time reveals, pack summary and deck-upgrade review all stay inside the full-screen flow.
- `Finish Pack & Return to Booster Vault` closes the full-screen flow and returns to the Booster Vault at the top.
- The full-screen flow respects the iPhone safe area.

## Compatibility
- No gameplay, card, deck, collection, balance, collector-number or Card Art Studio data changes.
- Build-wide cache busting is stamped to v0.11.37.

## Validation
- `npm test`: 199 passed, 0 failed.
- Artwork audit: 387/387 valid local images.
- Full-25 certification: 0 issues.
- Flow audit completed successfully.
