# WWE Legacy v0.13.45 — Build Certification

**Worlds Collide Mr. Iguana Completion Pass**

- **586/586 regression tests pass.**
- Validation: **58 Superstars / 58 decks / 533 gameplay cards / 0 orphans / 0 issues**.
- Flow audit: **58 Superstars / 0 issues**.
- Card-ID audit: **591/591 / 0 issues**; Evolution Series 1 is gap-free through **EVO1-074** and Worlds Collide Series 1 through **WC1-064**.
- Counter-state audit: **533 gameplay cards / 0 issues**; Mr. Iguana: **60 pages / 12 Momentum / full 8 Counter States / 4 Submission targets**.
- Card-effect audit: **41 test Superstars / 416 gameplay cards / 259 effect-bearing cards / 0 issues**.
- Economy smoke: **60 packs / 300 cards / 0 duplicate Entrance pulls / 0 foil-first failures**.
- Released-roster soak: **25 released Superstars / 6,000 matches / 0 stalls / 27.09 average turns / 5,476 pins / 524 submissions**.
- Released + RAW + Worlds Collide pre-release soak: **41 test Superstars / 16,400 matches / 0 stalls / 25.38 average turns / 15,150 pins / 1,250 submissions**. Mr. Iguana: **395-405 / 49.4% / 23.2 average turns**.
- Full authored-roster soak: **58 Superstars / 6,612 matches / 0 stalls / 25.37 average turns / 6,265 pins / 347 submissions**. Mr. Iguana: **105-123 / 46.1% / 23.0 average turns**.
- Dead-turn audit: **3,306 matches / 4.16 passes per match / maximum consecutive pass streak 4**.
- Custom-front artwork audit: **591 collector cards / 553 missing custom fronts**; newly authored Mr. Iguana cards use canonical fallback presentation until artwork is installed.
- Profile schema remains **31**.

## v0.13.45 certification focus
- Mr. Iguana completes the planned eight-Superstar Worlds Collide Series 1 roster.
- Mr. Iguana's authored deck is exactly 60 pages / 12 Momentum and uses only existing shared cards outside his exclusive package.
- **Play Dead** uses the global optional triggered Use / Decline flow and does not consume on decline.
- **La Yesca** searches only Mr. Iguana-exclusive Trademarks, applies the approved -1 Cost to the searched Trademark for the current Control sequence, and removes 1 opponent Adrenaline.
- **Iguanarana** is legal as a Body Elevated Counter and grants +1 Adrenaline only when it connects as a counter-attack.
- **Póngase Verde** correctly searches and discounts Chalino Driver by 1.
- **Spanish Fly** now requires Agility 2 only, preserving its C6/D10 / Running Aerial / grounding identity.
- Hijo del Vikingo's authored deck restores Spanish Fly x2 and remains method-accessible under his approved Momentum profile.
- Internal pre-release certification remains released + RAW + Worlds Collide while player-facing release gates remain unchanged.
- No reward-economy, booster-odds, UI, profile-schema or release-calendar changes are included.
