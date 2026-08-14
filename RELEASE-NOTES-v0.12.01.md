# WWE Legacy: Collectible Card Game — v0.12.01

## Official Survivor Series Houston + Shared Fundamentals

### Survivor Series — official 2026 Houston branding
- Retired the development-only `survivor-series-logo.svg`.
- Card Art Studio and live presentation now use `assets/branding/survivor-series-series-1/survivor-series-wargames-houston-2026.png`, based on WWE's official Survivor Series: WarGames 2026 Houston creative.
- Survivor Series presentation now follows the official creative with deep navy, orange and steel/white accents instead of the temporary red-vs-blue treatment.
- The Studio keeps an embedded PNG copy of the official logo treatment for local `file://` export safety.

### New shared cards
- **SVS1-034 — Elbow to the Back of the Head** — 1★ Common, C3 / D4 / Strike 1; standing opponent; +1 Head body-part damage on connect, one-shot/not maintainable.
- **SVS1-035 — Hip Toss** — 1★ Common, C2 / D2 / Technical 1; standing opponent; may Counter a Grapple Move and Grounds opponent.
- **MITB1-034 — Leg Drop** — 1★ Common, C3 / D5 / Agility 1; grounded opponent only.
- **RAW1-035 — Choke on the Ropes** — 1★ Common, C3 / D1 / Strike 1; standing opponent; maintainable Submission, Head Pressure 3. No literal rope-location gameplay state is required.
- **SD1-035 — Chops in the Corner** — 2★ Uncommon, C4 / D5 / Strike 1; standing opponent; +1 Chest body-part damage on connect, one-shot/not maintainable. No literal corner-state requirement is used.

All five cards are live booster/Deck Builder cards but are not forced into recommended Superstar decks until authentic users are explicitly assigned.

### Validation
- **65/65 tests pass.**
- Rebuild validation: **46 Superstars, 46 decks, 406 gameplay cards, 0 orphans, 0 issues**.
- Collector manifest: **452 cards**, gap-free with **0 card-ID issues**.
- Flow audit: **0 issues**.
- Deterministic balance simulation: **2,070 matches, 0 stalls, 36.7 average turns** (1,663 pins / 289 submissions / 118 turn-limit draws).
