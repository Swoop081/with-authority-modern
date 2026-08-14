# WWE Legacy: Collectible Card Game — v0.11.96

## Shared Move + Action Expansion Batch

Adds the full staged move/action batch from the SummerSlam reference pass without forcing any unauthenticated move into a recommended Superstar deck. New generic Moves are booster-pool additions and remain available to Deck Builder ownership rules.

### New cards
- **MITB1-030 Flapjack** — C4 / D6 / Strength 1; grounds opponent.
- **MITB1-031 Side Headlock** — C3 / D2 / Technical 1; Head submission pressure 3.
- **MITB1-032 Wristlock** — C2 / D1 / Technical 1; Arm submission pressure 2.
- **MITB1-033 Catch Your Breath** — 3★ Rare Action; booster-only; restore 5 HP up to starting HP.
- **RAW1-031 Knee to the Gut** — C3 / D4 / Strike 1; may Counter Grapple Moves.
- **RAW1-032 Throw Into Steel Steps** — C5 / D8 / Strength 1; +1 Back body-part damage on connect; not maintainable.
- **RAW1-033 Sleeper Hold** — C4 / D2 / Technical 2; Head submission pressure 4.
- **WC1-031 Scissors Kick** — C5 / D8 / Strike 2; grounds opponent.
- **WC1-032 Senton Splash** — C5 / D8 / Agility 2; grounded opponent only.
- **WC1-033 Spinning Back Kick** — C3 / D5 / Strike 1.
- **SD1-032 Throw Into Ringpost** — C5 / D8 / Strength 1; +1 Head body-part damage on connect; not maintainable.
- **SD1-033 Corner Barrage** — C4 / D6 / Strike 1; +2 Damage if a Strike connected earlier in the same Control sequence.

### Pool balance
The four smaller Season 1 subset pools are now exactly even at **29 gameplay cards / 25 booster-eligible cards / 33 collector-manifest cards each**: RAW Series 1, Money in the Bank Series 1, Worlds Collide Series 1, and SmackDown Series 1.

### Engine
- Added one-shot body-part damage for impact Moves. It uses the existing submission damage tracks but does not create or maintain a hold.
- Added self-heal Action support for Catch Your Breath.
- Added conditional Strike-chain damage support for Corner Barrage.

### Authenticity rule
No existing recommended deck was altered for these generic additions. A new Move only replaces/enters a Superstar recommended deck after an authentic user is confirmed.
