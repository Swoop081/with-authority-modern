# WWE Legacy v0.13.97 — Build Certification

**Build:** Card Art Studio Export Hotfix  
**Release date:** 22 August 2026  
**Supersedes:** v0.13.96 — Card Face Overlay Cleanup + Welcome Spacing Hotfix

## Locked fixes

- John Cena / Season 1 Card Art Studio exports no longer fail in locally opened (`file://`) Studio sessions because every packaged set logo now has an export-safe embedded data copy for local use.
- Exported Card Studio files now use the exact canonical flat install filename shown in the Studio rather than only the raw card art key.
- Example layered Superstar output: `card-layered-superstar-john-cena.webp`.
- Example layered Move output: `card-layered-move-mr-perfect-perfect-plex.webp`.
- Custom/legacy card fronts, HUD headshots and PNG fallback follow the same canonical destination-basename rule.
- No gameplay, balance, card data, pack odds, rewards, progression, collection state, Season 1 structure or live-set availability changed.

## Automated verification

- Node test suite: **798 discovered / 706 passed / 0 failed / 92 intentionally skipped historical contracts**.
- v0.13.97 targeted Card Art Studio regression tests: **2/2 passed**.
- Rebuild validation: **76 Superstars / 76 decks / 706 gameplay cards / 0 orphans / 0 issues**.
- Collector ID audit: **782 cards / 782 manifest entries / 0 issues**.
- Flow audit: **76 Superstars / 0 issues**.
- Card-effect audit: **574 scoped gameplay cards / 388 effect-bearing cards checked / 0 issues**.
- Counter/submission-state audit: **706 gameplay cards / 517 Moves / 0 issues**.
- Flat asset audit: **616 images / 310 installed gameplay-card fronts (158 layered + 152 flat) / 48 headshots / 38 menu portraits**.

## Regression coverage

The v0.13.97 test locks both reported failures:

1. export-safe local set logos include Season 1 Cena and all other packaged local-logo sets;
2. WebP and PNG output names are derived from the canonical `assets/images/...` destination path.

**Certification:** PASS
