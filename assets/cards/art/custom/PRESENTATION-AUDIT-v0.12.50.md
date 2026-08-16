# Presentation Audit — v0.12.50

## Goal
Make wrestler photography materially larger on menu screens after iPhone review showed the new official/profile art was still too small inside the compositions.

## Scale changes
| Surface | Desktop | <=600px | <=390px |
|---|---:|---:|---:|
| Home main Superstar | 76% width | 86% | 90% |
| Play mode Superstar | 66% | 74% | 78% |
| Home command-tile Superstar | 62% | 70% | 74% |
| General feature-hero Superstar | 90% | 99% | 103% |
| Season destination Superstar | 50% | 58% | 62% |

Utility-rail portraits are also enlarged to 66x102px desktop and up to 76x114px on narrow iPhones. Selection portraits and active run-node portraits overfill their image frames slightly so the wrestler reads clearly at small screen sizes.

## Composition safeguards
- Superstar imagery remains behind copy/actions.
- `object-fit: contain` and bottom anchoring remain locked for menu photography.
- Existing directional masks preserve text contrast on left-aligned copy.
- Collectible-card/product contexts are unchanged.

## Certification
232/232 automated tests pass; validation, card-ID and flow audits report 0 issues.
