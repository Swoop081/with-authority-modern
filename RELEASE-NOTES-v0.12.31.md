# WWE Legacy v0.12.31 — CPU Possession + Decision Pass

v0.12.31 **supersedes the rejected v0.12.30 experiment** and is built directly from the accepted v0.12.29 gameplay rules.

## What is deliberately unchanged

- Connected Moves still give the attacker **+1 Adrenaline** and the defender **-1 Adrenaline**.
- Control still stays with the attacker after a successful Move and changes on pass, successful Counter/Auto Counter, or failed pin.
- The v0.12.29 health-only pin curve remains **Green 0% / Amber 0–1% / Red 5–45%**.
- Submission threshold remains `max(12, round(Max HP × 0.28))`.
- Auto Counter remains 5 pages on first use, escalating by 1, and is still illegal against Finishers and counter-attacks.
- No trailing-player Auto Counter discount, no bonus kickout draw, no health-aware submission resistance, and no HP-gap rubber-banding were retained from v0.12.30.
- Card stats, Superstar HP, deck lists, counter states and Punch/Elbow exchange rules are unchanged from v0.12.29.

## CPU decision fixes

1. **Action → Move sequencing**
   - The CPU can now play useful pre-Move Actions while offense is already legal instead of ignoring them until the sequence is empty.
   - Temporary next-Move buffs are not deliberately fired at the end of a sequence where a pass would erase them.
   - Fire Up can be used before offense rather than being stranded as an end-of-sequence page.

2. **Support → Move sequencing**
   - Useful Supports are installed before attacking when a Move is already available instead of routinely being played only after the CPU has run out of offense.

3. **Submission commitment intelligence**
   - The CPU calculates whether its current hand can mathematically reach a tap.
   - If the hold cannot possibly finish, it releases rather than emptying its hand and then passing helplessly.
   - If the hold can finish, it commits and ditches the least strategically valuable page instead of always ditching hand index 0.

4. **Reversal conservation**
   - When the CPU has exactly one useful counter-capable Move left, it avoids spending that page as ordinary offense if a non-counter Move of nearly equal offensive value is available.
   - Finishers, Trademarks and lethal attacks are not suppressed by this reserve logic.

5. **Pin Escape timing**
   - The CPU no longer automatically burns Shoulder Up / Pin Escape on extremely weak covers.
   - It saves the guaranteed escape below 20% actual health-only pin chance and spends it once the cover reaches 20%+.
   - The underlying pin probability curve itself is unchanged.

## Certification

- **161/161 automated tests pass.**
- Validation: **0 issues / 0 orphans**.
- Card-ID audit: **0 issues**.
- Flow audit: **0 issues**.
- Counter-state audit: **0 issues**.
- Counter-chain audit: **0 non-Punch/Elbow cards at depth 2+**; max observed exchange depth 4.
- 9,800-match deep roster run: **0 stalls**, 24.91 average turns / 24 median.
- Winner HP: **35.6% average / 26.4% median** versus v0.12.29 same-size baseline **36.9% / 29.0%**.
- P1 win rate: **52.29%** versus baseline **52.85%**.
- Finish mix: **81.8% pin / 18.2% submission**.

## Balance consequence to review next

Smarter CPU play changes the measured roster rather than hiding it. In the 9,800-match certification André lands at **51.5%** and Charlotte Flair at **63.8%**. Those should be treated as the next balance-audit targets after the AI baseline is accepted; v0.12.31 does not compensate for them with hidden comeback mechanics or card-stat edits.
