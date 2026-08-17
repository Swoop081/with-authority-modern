# WWE Legacy: Collectible Card Game — v0.12.68

## Final Boss Head Anchor Hotfix

Presentation-only hotfix on top of v0.12.67. No gameplay, card, deck, economy, booster, Season XP, HP, Ladder, Championship Road, or collection rules changed.

- Keeps the approved enlarged Final Boss Rock treatment on the launch / returning-player hero.
- Preserves the exact v0.12.67 Rock scale and horizontal placement.
- Moves the transparent Rock render downward inside the clipped hero container so his full head and sunglasses remain visible on iPhone.
- Uses a stronger mobile-only vertical anchor at <=600px and <=430px to match the approved composition while leaving the copy hierarchy untouched.

Certification is recorded at package time.

## Certification
- 306/306 automated tests pass.
- 50 Superstars / 50 complete recommended decks / 435 gameplay cards.
- Validation: 0 orphans / 0 issues.
- Flow audit: 0 issues.
- Collector card-ID audit: 485/485 / 0 issues.
- Art audit retains the known unfinished custom-front backlog; no new art regression introduced by this hotfix.
