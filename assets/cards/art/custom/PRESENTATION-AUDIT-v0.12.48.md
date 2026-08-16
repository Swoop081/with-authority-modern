# v0.12.48 Presentation Audit — Dedicated Menu Render Cast

## Locked dedicated cast

| Set | Dedicated Superstar renders |
|---|---|
| SummerSlam — Series 1 | CM Punk, Roman Reigns, Cody Rhodes, Seth Rollins |
| Hall of Fame — Series 1 | Stone Cold Steve Austin, The Undertaker, Hulk Hogan, Ultimate Warrior |
| Evolution — Series 1 | Liv Morgan, Rhea Ripley, Paige, Becky Lynch |

Total dedicated renders: **12**.

## Removed from the dedicated pool
- Gunther
- Kevin Owens
- Brock Lesnar
- Oba Femi
- IYO SKY
- The Rock

These Superstars are not removed from the game and do not lose their ordinary local Superstar art. They simply no longer have a dedicated WWE menu-render override.

## Presentation separation
- Menu/presentation surfaces call `menuSuperstarPhotoFor()`.
- Requested dedicated cast resolves to `assets/art/wwe-menu-superstars/*.webp`.
- Other Superstars fall back to centralized local Superstar art.
- Store unlock products, Deck Lab card inventory, Collection, Catalogue, boosters, match cards and explicit collectible rewards remain card-driven.

## File audit
`assets/art/wwe-menu-superstars/` contains exactly 12 `.webp` files plus source provenance.

## Certification
- Automated tests: **225/225 PASS**.
- Validation: **0 issues**.
- Collector manifest: **482/482, 0 issues**.
- Flow audit: **0 issues**.
