# WWE Legacy v0.13.74 — RAW Live + New Generation Schedule Pass

Certification date: 20 August 2026
Package: `WWE-Legacy-v0.13.74-RAW-Live-New-Generation-Schedule-Pass.zip`

## Scope
- Turn **RAW — Series 1** live for players immediately.
- Move the **5 September 2026** subset release slot to **New Generation — Series 1**.
- Extend **Championship Road** with **two new RAW sections of four matches each** (32 matches total).
- Surface RAW content across player-facing systems that obey the release calendar.
- Rotate the clean launch splash between:
  - the existing **Final Boss** promotion, and
  - a new **RAW IS HERE** promotion using overlapping Logan Paul / Raquel Rodriguez / Sol Ruca Superstar cards.

## Locked outcomes
- `raw-series-1` now releases at **local midnight on 20 August 2026**.
- `new-generation-series-1` is now the scheduled **5 September 2026** subset release.
- RAW is available in boosters, Catalogue, Store rotation eligibility, Exhibition opponent pools, and other release-gated player systems.
- Championship Road expands from **24** to **32** matches and adds:
  - **Raw · Part I** (25–28)
  - **Raw · Part II** (29–32)
- The splash screen randomly selects one promo per load while preserving the existing clean-launch structure.

## Certification
- Test command: `npm test`
- Result: **697 / 697 tests passed**
- Failures: **0**

## Notes
- Birthday Bash authoring remains unchanged in this pass.
- Four-set balance audit was requested next and is not part of this package artifact.
