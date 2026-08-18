# WWE Legacy v0.13.9 — Build Certification

- Regression tests: **434/434 pass**
- Focused v0.13.9 presentation regressions: **2/2 pass** (Season full-width single-line Daily Booster control; Live Event selected-card/CTA/hero containment)
- Validation: **50 Superstars / 50 decks / 460 gameplay cards / 0 orphans / 0 issues**
- Flow audit: **50 Superstars / 0 issues**
- Card-ID audit: **510/510 / 0 issues**
- Counter-state audit: **460 gameplay cards / 331 Moves / 0 issues**
- Card-effect audit: **29 test Superstars / 323 gameplay cards / 189 effect-bearing cards / 0 issues**
- Economy smoke: **60 packs / 300 cards / 0 duplicate Entrance pulls / 0 foil-first failures**
- Released + RAW pre-release soak: **29 Superstars / 8,120 matches / 0 stalls / 26.93 average turns / 7,438 pinfalls / 682 submissions**
- Art audit: **510 collector cards / 473 unfinished custom fronts** (known artwork backlog)

## Presentation correction

The Season Daily Login Booster had conflicting historical compact-strip rules with greater selector specificity than the later full-width button rule. v0.13.9 explicitly targets the combined CTA/strip selector so the purple control fills the available phone width and remains one line.

The Live Event detail CTA inherited the global `.start-match` minimum width (`min(360px, 90vw)`), which could exceed the right-hand column of the two-column selected-Superstar panel. v0.13.9 sets that context to `min-width:0; width:100%; max-width:100%` and keeps the selected card bounded. The hero wrestler render is likewise constrained within the hero panel at phone widths.

No accepted Live Event route/opponent layout, gameplay, card data, economy, progression, release calendar or save format changed.
