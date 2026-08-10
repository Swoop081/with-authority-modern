# WWE Legacy: Collectible Card Game — v0.9.1

## Persistent menu navigation
- The bottom primary navigation is now fixed to the viewport on menu/hub screens.
- It no longer sits at the bottom of page content, so long screens such as the 50-tier Season Road do not require scrolling down to reach navigation.
- The bar remains visible while browsing Home, Play, Cards, Packs, Season, Profile/Deck-related screens and Options.
- The bar is explicitly hidden during live match play, splash/onboarding and Superstar unlock celebration sequences.
- Menu pages reserve safe-area space so content is not obscured behind the fixed bar on iPhone.

## Options / testing
- Added a dedicated OPTIONS destination to both the fixed bottom navigation and Main Menu.
- Added Game & Testing screen.
- Added Reset Progress for development/testing.
- Reset is deliberately two-step: Reset Progress → Confirm Reset, with a Cancel option.
- Confirming wipes the local WWE Legacy profile, collection, Season progress, unlocked Superstars and saved decks, then returns to first-time onboarding.

## Polish
- Bottom navigation expanded to six compact destinations: Home, Play, Cards, Packs, Season, Options.
- Build label updated to v0.9.1.
- Profile Superstar count now uses the dynamic roster total.

## Certification
- 143/143 automated regression tests passing.
