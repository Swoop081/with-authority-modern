# WWE Legacy v0.11.93 — Balance Audit

## Pin Bonus removal baseline

The active game no longer contains card-based Pin Bonus modifiers. Pin odds are health-only:

- Green (>60% HP): no Pin attempt.
- Amber (40–60% HP): 1–3% chance.
- Red (≤40% HP): 15% at the Red threshold, scaling to 90% at 0 HP.

## Deterministic simulation

Full paired-roster simulation: **3,444 matches**.

- Stalls: **0**
- Average turns: **32.88**
- Pin finishes: **3,049**
- Submission finishes: **395**
- CPU Pin attempts in Green: **0**
- CPU Pin attempts in Amber: **0**
- CPU Pin attempts in Red: **8,427**
- Successful Red pins: **3,049**

The previous v0.11.92 deterministic baseline averaged 33.65 turns, so removing Pin Bonus did not lengthen matches after the health-only curve retune.

## Roster note

The mechanic change redistributes strength toward wrestlers who naturally create deeper HP deficits rather than wrestlers whose finishers carried large Pin Bonus values. The top deterministic rates in this pass are The Rock 83.5%, Raquel Rodriguez 72.0%, Roman Reigns 69.5%, Logan Paul 66.5%, and Charlotte Flair 65.2%.

This is intentionally recorded rather than hidden with ad-hoc Pin modifiers. The next roster balance pass should tune genuine card/ability power if those rates are changed; Pin Bonus should remain retired.
