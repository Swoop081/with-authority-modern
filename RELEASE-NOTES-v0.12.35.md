# WWE Legacy v0.12.35 — Counter Terminality + Cache Coherence Hotfix

Supersedes v0.12.34. This is a narrow iPhone-test hotfix; no roster, card-stat, hand-flow, Momentum, Adrenaline, pin-curve or submission-balance values change.

## Counter terminality
- An offensive reversal that becomes a counter-attack resolves immediately by default.
- Arm Drag Counter → Arm Drag Counter is illegal.
- Jawbreaker → Jawbreaker remains illegal.
- Auto Counter remains illegal against counter-attacks.
- Punch/Elbow remains the only explicit recursive exchange family and may continue Punch↔Punch/Elbow exchanges.
- MatchEngine now has a direct terminality guard in addition to rules-layer legality, preventing a reply window from being opened accidentally.

## iPhone/Safari cache coherence
- Every relative JavaScript module import in the browser graph now carries the current `?v=0.12.68` cache key, including nested engine/data imports.
- The stamping tool now enforces this automatically for static and dynamic relative `.js` imports.
- This prevents Safari/GitHub Pages from assembling a current `app.js` with a stale nested `rules.js` or `MatchEngine.js`.

## Match-ending rules retained
- Positive-HP pin odds are unchanged from v0.12.34.
- Exactly 0 HP remains a 75% natural pin success chance (25% natural kickout).
- 0 HP is not an automatic knockout; a pin, submission or explicit exhaustion decision must still end the match.

## Certification
- 170/170 automated tests pass.
- Validation, card-ID, flow and counter-state audits report 0 issues.
- Counter-chain audit: 2,450 matches, 0 stalls, 0 non-Punch/Elbow depth-2+ counter-attacks.
- Standard balance run: 2,450 matches, 0 stalls, 25.67 average turns.
