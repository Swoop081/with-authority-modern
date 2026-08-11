# WWE Legacy v0.11.30 — Starter Overlay Cleanup

## Launch layout
- Uses the complete `100svh` visible viewport on the splash screen.
- Splash content is a five-row grid: brand, flexible Final Boss promo, profile, Enter button, local-profile note.
- The Final Boss promo owns the remaining vertical space instead of leaving unused space under the launch controls.

## Final Boss promo readability
- Promo copy is right-aligned and pushed away from the Superstar card edge.
- Kicker, headline, body copy, footer and Enter/profile text are larger on normal phone heights.
- Short phone heights retain a compact override to guarantee the whole launch experience fits without scrolling.

## Scope
- UI/CSS only. No card, deck, collector-number, balance or Card Art Studio data changes.


## v0.11.30 hotfix
- Force-hide the sticky WWE Legacy top banner on the first-time onboarding screen.
- Replace the inline ability label with a dedicated starter ability block so the ability name no longer renders as a white overlay chip.
- Add safe-area-aware top spacing so onboarding content clears iPhone status-bar space more reliably.
