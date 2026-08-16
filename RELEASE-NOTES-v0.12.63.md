# WWE Legacy: Collectible Card Game — v0.12.63

## Card Back Fallback Pass

- Fixes blank collectible rectangles in Collection and Catalogue when a canonical custom finished-front path exists but the actual private WebP is not installed.
- Every non-Superstar collectible now keeps the canonical WWE Legacy rules/details back directly underneath the optional finished-front image.
- If the custom image loads, it remains the visible front exactly as authored.
- If the custom image is missing or fails, the art layer is removed and the original card back remains visible instead of a blank panel.
- Front and reverse therefore both present the canonical back when no custom front is installed; tapping cannot expose an empty face.
- Superstar presentation is unchanged. Gameplay, card data, ownership, deck logic and booster logic are unchanged.

## Certification

- 294 / 294 automated tests pass.
- Validation: 50 Superstars / 50 decks / 435 gameplay cards / 0 orphans / 0 issues.
- Flow audit: 50 Superstars / 0 issues.
- Card-ID audit: 485 / 485 / 0 issues.
