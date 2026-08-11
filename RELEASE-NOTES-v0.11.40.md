# WWE Legacy v0.11.40 — Master Card Catalogue + Super Sort

## Card Catalogue is now a real standalone destination
- Fixed the broken/crashing Catalogue route from Home, bottom navigation and My Collection.
- Catalogue now has its own `catalogue` screen instead of trying to render the owned Collection screen in an all-card mode.
- The full 387-card released pool is available without creating 387 full card/image components at once: results are paged at 48 cards per page for mobile stability.
- Every unowned card remains visible but is greyscale/dimmed.
- Every owned card shows total quantity plus Normal/Foil breakdown when applicable.

## SUPER SORT
The new Super Sort can combine:
- text search across card name, collector code, effect text, set and Superstar usage;
- Set;
- Superstar association using either current recommended-deck + linked-card usage or exclusive-only scope;
- Shared / Generic cards;
- ownership state;
- card type;
- rarity;
- Method;
- Move Type;
- Move Family;
- Standard / Signature / Trademark / Finisher class;
- Cost with `=`, `≤`, or `≥`;
- Damage with `=`, `≤`, or `≥`;
- exact Strength, Strike, Technical and Agility requirements.

Sorting supports collector number, alphabet, set, Superstar, card type, rarity, cost, damage, each method requirement and owned quantity, in ascending or descending order.

## Collection / Catalogue separation
- Buttons labelled Collection now return to My Collection.
- Card Catalogue links always open the standalone master Catalogue.
- Collection branding now reflects the live pool: 387 cards across 4 sets instead of the old placeholder 510 / three-set copy.

## Compatibility
- No cards, decks, balance, collector numbers, booster pools or Card Art Studio data changed.
- Build-wide cache busting is stamped to v0.11.40.

## Validation
- `npm test`: 208 passed, 0 failed.
- Artwork audit: 387/387 active collectibles resolve to local artwork.
- Full-25 certification: 0 issues.
- Flow audit completed successfully.
