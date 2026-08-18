# WWE Legacy v0.13.31 — Build Certification

**Automatic Layered Front Fallback + Biel Toss Pass**

- **513/513 regression tests pass.**
- Validation: **50 Superstars / 50 decks / 468 gameplay cards / 0 orphans / 0 issues**.
- Flow audit: **50 Superstars / 0 issues**.
- Card-ID audit: **518/518 / 0 issues**.
- Counter-state audit: **468 gameplay cards / 337 Moves / 0 issues**.
- Card-effect audit: **29 test Superstars / 327 gameplay cards / 192 effect-bearing cards / 0 issues**.
- Economy smoke: **60 packs / 300 cards / 0 duplicate Entrance pulls / 0 foil-first failures**.
- Released-roster soak: **25 released Superstars / 6,000 matches / 0 stalls / 27.18 average turns / 5,480 pins / 520 submissions**.
- Released + RAW pre-release soak: **29 test Superstars / 8,120 matches / 0 stalls / 26.64 average turns / 7,419 pins / 701 submissions**.
- Full authored-roster soak: **50 Superstars / 4,900 matches / 0 stalls / 26.07 average turns / 4,640 pins / 260 submissions**.
- Dead-turn audit: **2,450 matches / 4.39 passes per match / maximum consecutive pass streak 4**.
- Custom-front artwork audit: **518 collector cards / 481 missing custom fronts**. The one-card increase is Biel Toss; automatic layered fallback does not require any artwork duplication.
- Active hidden pre-release scope remains **currently released content + RAW Series 1 only**.
- Profile schema remains **30**.

## v0.13.31 certification focus
- The old per-card `LAYERED_FRONT_IDS` activation registry is retired.
- Supported non-Superstar collectible cards automatically try `assets/cards/art/layered/<type>/<card-id>.webp` first.
- A successfully loaded layered plate receives canonical live data overlays; a missing/failed layered plate automatically falls back to the existing flat/custom front and then the established rules/details fallback.
- Card Art Studio instructions match the automatic layered install/fallback workflow.
- **Biel Toss — SS1-148** is a shared 1★ Common at C3/D5/Strength 1/Grapple/Front Control and grounds the opponent.
- Oba Femi’s recommended deck remains exactly 60 pages / 12 Momentum with **2 Biel Toss + 1 Body Slam**; Biel Toss is in his Lead Off 5.
- All v0.13.30 Kevin Owens Trademarks and future MITB shared content remain intact.
