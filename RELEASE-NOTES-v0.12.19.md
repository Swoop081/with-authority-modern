# WWE Legacy v0.12.19 — Counter Anchor Correction + Accessible Reversal Pass

## Corrected eight-state anchor model
v0.12.19 corrects the v0.12.18 interpretation without removing the expanded reversal pool.

The original eight cards remain exact one-to-one anchors:
- Punch → Arm Extended
- Drop Toe Hold → Leg Extended
- Dropkick → Running Aerial
- Knees Up → Diving Aerial
- Hurricanrana → Body Elevated
- Headbutt → Torso Trapped
- Arm Drag → Front Control
- Back Elbow → Rear Control

Only Dropkick and Hurricanrana carry an Agility 1 Method Momentum requirement. The other six anchors have no printed Method Momentum gate.

## Expanded alternatives stay additive
The extra reversal cards are additional answers, not replacements for the eight anchors. The pool includes Dodge, Block, Up and Over, Standing Switch, Rollover Counter, Backflip Counter, Catch the Foot, Arm Drag Counter and Jawbreaker, together with natural existing counters such as Duck, Sidestep, Dragon Screw, Back Body Drop, Reverse Elbow, Hip Toss, Knee to the Gut, No Sell and Tilt-a-Whirl Headscissors.

Every physical state has at least four distinct reversal options:
- Arm Extended: 5
- Leg Extended: 6
- Running Aerial: 6
- Diving Aerial: 5
- Body Elevated: 5
- Torso Trapped: 4
- Front Control: 6
- Rear Control: 5

## No broad-type bypass
Once a Counter has been migrated to the physical-state system, the engine no longer allows its old broad Strike / Grapple / Aerial counter text to bypass the eight-state relationship. Exact named-card reversals remain supported.

## Agility-0 accessibility
All 12 authored Superstars with an Agility limit of 0 now have Method-accessible answers in their recommended deck to:
- Running Aerial
- Diving Aerial
- Body Elevated

Examples include Up and Over for Running Aerial, Knees Up for Diving Aerial, and Rollover Counter / other non-Agility options for Body Elevated.

## Submission body-area counters
The four Submission target areas now have multiple natural responses drawn from existing move logic:
- Arm: Arm Drag, Arm Drag Counter, Rollover Counter, Chain Wrestling
- Leg: Drop Toe Hold, Dragon Screw, Catch the Foot, Enzuigiri, Rollover Counter, Chain Wrestling
- Back: Standing Switch, Hip Toss, Rollover Counter, Chain Wrestling
- Neck / Head: Jawbreaker, Back Elbow, Reverse Elbow, Headbutt, Chain Wrestling

Jawbreaker explicitly counters Neck / Head-targeting Submission attempts.

## Recommended decks
- 50/50 recommended decks remain exactly 60 pages.
- Every deck retains exactly 12 Momentum pages.
- Minimum counter-capable pages remains 9.
- Every deck has all 8 counter states and all 4 Submission body areas represented.
- The counter-state audit additionally verifies that those responses are actually legal within each Superstar's Method Limits.

## Certification
- Automated regression tests: **123/123 passed**.
- Rebuild validation: **50 Superstars / 50 decks / 432 gameplay cards / 0 orphans / 0 issues**.
- Collector manifest: **482/482**, gap-free.
- Counter-state audit: **32 reversal-capable cards / 0 issues**.
- Ordered balance: **2,450 matches / 0 stalls / 16.62 average turns**.
- Extended balance: **4,900 matches / 0 stalls / 16.67 average turns**.
- Dead-turn audit: **1.12 passes per match**; one deterministic matchup reached a four-pass sequence, maximum 4.
