# WWE Legacy CCG — v0.12.45 Visual Cleanup Pass

v0.12.45 is a presentation-only follow-up to the v0.12.44 Visual Architecture Pass. It is based on direct iPhone screenshots of Home, Play, Season, Challenges, Booster Vault and Store.

## Home
- The foreground hero card now matches the player’s starter Superstar instead of being hard-coded to Roman Reigns.
- The foreground card is smaller and lifted above the bottom stat rail so it no longer collides with the HUD-like statistics.
- The third hero stat is now Season Tier rather than repeating the Pack count already visible in the global top chrome and Booster Vault tile.
- Deck Lab uses Seth Rollins as its featured card to avoid duplicating CM Punk repeatedly on the same Home screen.

## Season
- The Final Boss Season hero is restored to first position on the page.
- Daily Login Booster is converted from a large stacked panel into a compact game-command strip.
- Long explanatory text is shortened and hidden on narrow mobile layouts.
- Season hero and progress panels use sharper, lower-radius plates consistent with the new game architecture.

## Challenges
- Removed the redundant Main Menu button because Home is already permanently available in the bottom navigation.
- Hero height is reduced and status indicators are compacted.
- SummerSlam, Hall of Fame and Evolution set progress now fit side-by-side as a three-plate mobile deck rather than three tall stacked rows.
- Challenge and milestone containers use sharper game plates instead of large rounded web cards.

## Booster Vault
- The unopened pack area is now a horizontal physical-pack shelf/carousel.
- A single pack no longer expands into a large empty full-width panel.
- Pack products use compact angular plates and snap horizontally when multiple pack types are present.
- Packs Ready, Packs Opened, Superstars and Universe Points now fit as four compact statistics in one row.
- Booster hero height is reduced and its mobile explanatory paragraph is suppressed to prioritise the physical packs.

## Store
- Removed the duplicate Universe Points balance pill; Universe Points already live in the global resource chrome.
- Store hero, refresh strip and featured booster offer are more compact.
- Featured booster becomes a horizontal pack + offer plate on mobile instead of a tall stacked block.
- Store plates use sharper corners and tighter spacing.

## Release coherence
- Build/cache stamps are aligned to 0.12.45 across browser modules.
- Card Art Studio visible version and script cache key are aligned to 0.12.45.

## Gameplay
No gameplay, card data, roster balance, AI, pin, submission, Momentum, Entrance, Adrenaline, counter or economy rule changes are included in this release. v0.12.43 gameplay balance and v0.12.44 shell architecture remain intact.

## Certification
- 211/211 automated tests passing.
- Validation: 50 Superstars / 50 decks / 432 gameplay cards / 0 orphans / 0 issues.
- Collector manifest: 482 cards / 482 manifest entries / 0 issues.
- Flow audit: 50 Superstars / 0 issues.
