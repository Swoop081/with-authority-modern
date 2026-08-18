# WWE Legacy v0.13.30 — Build Certification

**Kevin Owens Trademarks + MITB Shared Moves Pass**

- **511/511 regression tests pass.**
- Validation: **50 Superstars / 50 decks / 467 gameplay cards / 0 orphans / 0 issues**.
- Flow audit: **50 Superstars / 0 issues**.
- Card-ID audit: **517/517 / 0 issues**.
- Counter-state audit: **467 gameplay cards / 336 Moves / 0 issues**.
- Card-effect audit: **29 test Superstars / 326 gameplay cards / 191 effect-bearing cards / 0 issues**.
- Economy smoke: **60 packs / 300 cards / 0 duplicate Entrance pulls / 0 foil-first failures**.
- Released-roster soak: **25 released Superstars / 6,000 matches / 0 stalls / 27.18 average turns / 5,482 pins / 518 submissions**.
- Released + RAW pre-release soak: **29 test Superstars / 8,120 matches / 0 stalls / 26.64 average turns / 7,418 pins / 702 submissions**.
- Full authored-roster soak: **50 Superstars / 4,900 matches / 0 stalls / 26.14 average turns / 4,621 pins / 279 submissions**.
- Dead-turn audit: **2,450 matches / 4.39 passes per match / maximum consecutive pass streak 4**.
- Custom-front artwork audit: **517 collector cards / 480 missing custom fronts**. The increase of five is exactly the five newly authored cards in this content pass.
- Active hidden pre-release scope remains **currently released content + RAW Series 1 only**; MITB additions remain hidden until the MITB Series 1 release window.
- Profile schema remains **30**.

## v0.13.30 certification focus
- Kevin Owens gains two new 3★ Rare Trademarks with dedicated in-engine regression coverage.
- Avalanche Fisherman’s Buster uses the existing Control-sequence method-history discount system and correctly reaches C7 after a prior Strike.
- KO’s Swanton Bomb uses a generic Control-sequence method-history damage bonus and correctly reaches D13 after a prior Strength Move.
- Kevin Owens’ recommended deck remains exactly 60 pages / 12 Momentum and contains 2 copies of each new Trademark.
- Pop-Up Powerbomb remains the single Trademark granted by the lean later-Superstar unlock package; neither new Rare Trademark is auto-granted.
- Trash Can to the Back applies +1 persistent Back damage.
- Chair to the Gut introduces a generic one-use next-Grapple Cost discount and is covered by engine tests.
- Splash is the approved plain shared Common at C3/D5/Strength 1 with no additional effect.
- Stable collector identities are SS1-146, SS1-147 and MITB1-035 through MITB1-037.
- All v0.13.29 iPhone presentation and v0.13.28 pinned-app update reliability behavior remains intact.
