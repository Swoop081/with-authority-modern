# WWE Legacy v0.13.90 — Era Logo Presentation Hotfix

Presentation-only hotfix on the v0.13.89 live-ready baseline.

## Locked fixes
- Golden Era Card Art Studio/front branding keeps the existing classic WWF block logo and removes the added `GOLDEN ERA` text underneath it.
- Attitude Era Card Art Studio/front branding keeps the existing WWF scratch logo and renders it at exactly 2× the previous draw-box size.
- Local `file://` Card Art Studio mode uses the corrected Golden Era logo override, so preview/export do not fall back to the stale embedded version.
- No gameplay, card data, economy, rewards, four-tier progression, CPU scaling, live-set pool, starter flow or balance changes.

## Verification
- Automated tests: 777 discovered / 714 passed / 0 failed / 63 intentionally skipped historical contracts.
- v0.13.90 dedicated presentation tests: 3/3 passed.
- Validation: 74 Superstars / 74 decks / 693 gameplay cards / 0 orphans / 0 issues.
- Collector IDs: 767/767 / 0 issues.
- Flow audit: 74 Superstars / 0 issues.
