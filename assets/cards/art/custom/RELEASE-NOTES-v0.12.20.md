# WWE Legacy v0.12.20 — Mobile Card Readability + Flame Momentum Pass

## Leapfrog reversal
- Leapfrog remains a real gameplay Move/reversal at **Cost 2 / Damage 0 / Agility 1**.
- It counters **Running Aerial** specifically through the eight-state system.
- Its obsolete broad Strike/Grapple counter list has been removed so it cannot reverse unrelated attacks through legacy matching.
- It remains an additional Running Aerial answer alongside Dropkick and the Method-free options already present for Agility-0 Superstars.

## Full-art Move card readability
The new full-art Move fronts keep their authored artwork, but Cost and Damage are now repeated by the live UI as two large bottom-corner stat tiles.

This directly addresses the iPhone hand-size problem seen on cards such as Superman Punch:
- Cost/Damage numbers are now the dominant information in the corner tiles.
- The labels are enlarged but remain secondary to the values.
- The overlay is limited to the two stat tiles rather than adding a dark top/bottom shade over the card artwork.
- Finished Move fronts now receive the `is-full-art-move` runtime class explicitly, and the fallback handler removes it if finished art fails to load.

The Card Art Studio export renderer has also been updated so future/re-exported Move fronts bake in substantially larger Cost/Damage tiles:
- Stat labels: 14.5px reference size / heavier weight.
- Stat values: 62px reference size / maximum weight.
- Tiles are wider and taller than the previous design.

## Momentum card redesign
The live Momentum renderer has been rebuilt around the approved full-card flame identity:
- **Strength — orange** `#ff8a1f`
- **Strike — red** `#ef3f4e`
- **Technical — green** `#36c86f`
- **Agility — blue** `#2fa8ff`

The previous viewport-sized typography has been replaced with card-container-relative sizing, preventing `+1`, Method names and MOMENTUM text from being cropped on narrow in-match cards.

Each Momentum front now has:
- seven explicit coloured flame tongues across the lower card,
- large central `+1`,
- clear Method name,
- separate `MOMENTUM` label,
- compact WWE Legacy header and set logo,
- no tiny footer copy competing for space.

The Card Art Studio Momentum renderer uses the same four canonical colours and flame-led composition, so exported Momentum cards and the live game now share the same visual direction.

## Certification
- Automated tests: **127/127 passed**.
- Rebuild validation: **50 Superstars / 50 decks / 432 gameplay cards / 0 orphans / 0 issues**.
- Collector manifest: **482/482**, gap-free.
- Counter-state audit: **314 Moves / 32 reversal-capable cards / all 8 physical states covered / all 4 Submission areas covered / 0 issues**.
- Ordered balance: **2,450 matches / 0 stalls / 16.62 average turns**.
- Extended balance: **4,900 matches / 0 stalls / 16.67 average turns**.
- Dead-turn audit: **1.12 passes per match**; one deterministic matchup reached a four-pass sequence, maximum 4.

## Verification status
The data, runtime class wiring, CSS rules, Card Art Studio renderer and automated regressions are code-verified. The revised card fronts still require final **on-device visual verification** at actual iPhone hand/play-pile size.
