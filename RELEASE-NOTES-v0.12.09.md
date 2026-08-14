# WWE Legacy: Collectible Card Game — v0.12.09
## Survivor Series — Series 1 Complete Roster Pass

v0.12.09 completes the eight-Superstar Survivor Series — Series 1 roster by adding the three newly locked designs: **Solo Sikoa, Jade Cargill and Nia Jax** to Bron Breakker, Drew McIntyre, Randy Orton, Sami Zayn and Jacob Fatu.

### Solo Sikoa — LOCKED
- HP 54; Strike Unlimited / Strength 5 / Agility 2 / Technical 1.
- Starter Momentum: Strike 6 / Strength 5 / Agility 1.
- Entrance **Taking Over**: +1 Strike Momentum, +1 Strength Momentum, +1 Adrenaline.
- Ability **Street Champion**: once per Control sequence, first connected Strike dealing 5+ Damage drains 1 additional opponent Adrenaline.
- Special **Sole Survivor**: once per match after Solo loses Control, draw 2 and gain +1 Adrenaline.
- Trademark **Spinning Solo** C7/D11/Strength 2: grounds, tutors Samoan Spike and discounts it by 2 this Control sequence.
- Finisher **Samoan Spike** C9/D16/Strike 3: standing opponent, grounds, +1 Head body-part damage.

### Jade Cargill — LOCKED
- HP 55; Strength Unlimited / Strike 5 / Agility 3 / Technical 1.
- Starter Momentum: Strength 6 / Strike 4 / Agility 2.
- Entrance **A Storm Is Coming**: +1 Strength Momentum, +1 Strike Momentum, +1 Adrenaline.
- Ability **Believe the Hype**: once per Control sequence, first connected Move dealing 7+ Damage gains +1 Adrenaline.
- Special **Superhuman**: once per match after a connected Strength Move, draw 1 and the next Move this Control sequence deals +2 Damage.
- The existing shared **Pump Kick** is reused rather than duplicated, preserving the one-card-per-real-move rule. It is now C6/D9/Strike 2 and a shared Trademark. When Jade uses it, it tutors **Jaded** and discounts Jaded by 2 this Control sequence.
- Finisher **Jaded** C10/D17/Strength 3: standing opponent, grounds opponent.

### Nia Jax — LOCKED
- HP 57; Strength Unlimited / Strike 4 / Agility 2 / Technical 1.
- Starter Momentum: Strength 7 / Strike 4 / Agility 1.
- Entrance **Irresistible Force**: +2 Strength Momentum and +1 Adrenaline.
- Ability **Crushing Weight**: once per Control sequence after a connected Strength Move grounds the opponent, Nia's next Move costs 1 less.
- Special **Not Like Most**: once per match when taking 10+ Damage from one Move, reduce that Damage by 4 and gain +1 Adrenaline.
- Trademark **Avalanche Samoan Drop** C7/D12/Strength 3: grounds, tutors Annihilator and discounts it by 2 this Control sequence.
- Finisher **Annihilator** C10/D17/Strength 3: grounded opponent only.

### Decks and collector numbering
- Solo, Jade and Nia each have a complete authored **55-page recommended deck with exactly 12 Momentum**.
- Survivor Series — Series 1 is now exactly eight playable Superstars.
- New Survivor collector numbering runs through **SVS1-049**.
- Card Art Studio generated data now contains all 49 Superstars and all 466 collector-manifest cards.

### Engine support
- Street Champion, Sole Survivor, Believe the Hype, Superhuman, Crushing Weight and Not Like Most are live engine mechanics, not text-only placeholders.
- Spinning Solo → Samoan Spike, Pump Kick → Jaded and Avalanche Samoan Drop → Annihilator search/discount sequences are live.
- No Pin Bonus mechanics were reintroduced.

### Validation
- **84/84 automated tests pass.**
- **49 Superstars / 49 complete recommended decks.**
- **417 gameplay cards / 466 collector-manifest cards.**
- **0 orphan cards / 0 rebuild issues.**
- Card-ID and flow audits clean.
- Deterministic simulation: **4,704 matches, 0 stalls, 36.63 average turns, 3,717 pins, 666 submissions, 321 turn-limit draws.**

### Balance note
This package preserves the locked designs rather than silently tuning them during implementation. The first full-roster deterministic pass has Jade and Solo testing high relative to the field; that is intentionally left for a separate roster balance audit.
