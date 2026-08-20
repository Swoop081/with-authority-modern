# WWE Legacy v0.13.75 — Superstar Art Resolver Pass

Certification date: 20 August 2026
Package: `WWE-Legacy-v0.13.75-Superstar-Art-Resolver-Pass.zip`

## Scope
- Make Card Art Studio's Superstar export filename authoritative in the live game.
- Fix layered Superstar cards for newer sets such as RAW and New Generation.
- Fix match-HUD headshots for every current/future roster Superstar.
- Preserve v0.13.74 RAW live status, New Generation 5 September schedule, 32-match Championship Road, and randomized RAW/Final Boss splash.

## Locked resolver contract
For Superstar ID `roxanne-perez`:
- Layered front: `assets/cards/art/layered/superstars/roxanne-perez.webp`
- Flat finished front: `assets/cards/art/custom/superstars/roxanne-perez.webp`
- HUD headshot: `assets/cards/art/custom/headshots/roxanne-perez.webp`

No `superstar-` prefix is required for Card Studio-generated Superstar image filenames.

## Certification
- `npm test`: **701 / 701 passed**
- `npm run validate`: **62 Superstars / 62 decks / 562 gameplay cards / 0 orphans / 0 issues**
- `npm run card-ids`: **624 cards / 624 manifest entries / 0 issues**
- `npm run flow`: **62 Superstars / 0 issues**
