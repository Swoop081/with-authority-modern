# WWE Legacy v0.13.93 — Build Certification

## Scope
Presentation-only Welcome onboarding hotfix on top of v0.13.92. No gameplay or economy values changed.

## Verification
- Node regression suite: **788 discovered / 714 passed / 0 failed / 74 intentionally skipped historical contracts**.
- Dedicated v0.13.93 Welcome UI tests: **2/2 passed**.
- Validation: **76 Superstars / 76 decks / 706 gameplay cards / 0 orphans / 0 issues**.
- Collector IDs: **782/782 / 0 issues**.
- Flow audit: **76/76 / 0 issues**.
- Card-effect audit: **574 scoped / 388 effect-bearing / 0 issues**.
- Counter/submission state audit: **0 issues**.

## Welcome iPhone gate
- Era selection uses set identity rather than fake pack art.
- Five set choices use a compact two-column layout with SummerSlam spanning the final row.
- Welcome Superstar collectible card is explicitly block-sized from the viewport so non-interactive `<span>` cards cannot collapse.
- Reveal is constrained to one iPhone viewport with a full-width bottom Continue CTA.
