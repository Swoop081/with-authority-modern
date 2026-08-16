# v0.12.38 Presentation Audit — Climb the Ladder / Championship Road

## Problems observed in iPhone v0.12.37
- Hero consumed too much vertical space.
- Branch selector clipped later choices horizontally.
- Superstar selection card was large enough to force the primary action below the initial viewport.
- Championship Road repeated current run information in both the status panel and the stage list.
- Four Championship stages and up to eight Ladder rungs were rendered as tall vertical rows, guaranteeing scrolling.
- Mode screens did not match the compact premium presentation quality of the newer Home/Season/Booster surfaces.

## v0.12.38 corrections
- Compact premium hero with integrated branch selector + four-stat strip.
- All branch choices visible together on phone widths.
- Compact full-card horizontal Superstar selector; tap-to-flip remains.
- Active state uses one command card instead of repeated large information blocks.
- Championship Road uses a four-column stage rail.
- Climb the Ladder uses a four-column / two-row rung grid for eight-opponent branches.
- Stronger accent glow, glass-panel depth, current-stage emphasis and cleared-stage treatment.

## Mobile bounding values
At <=600px:
- Hero: 214px.
- Status ribbon: 25px minimum.
- Active command: 76px minimum.
- Rung node: 63px minimum.
- Superstar selection card: 112x164px.

At <=390px:
- Hero: 206px.
- Superstar selection card: 105x154px.

These bounds are designed around the fixed 112px bottom navigation dock and modern iPhone safe-area behavior already used by the application.
