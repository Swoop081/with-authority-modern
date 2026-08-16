# WWE Legacy: Collectible Card Game — v0.12.11
## Global Finisher Momentum Audit

v0.12.11 applies the canonical global rule that **Finishers never require Method Momentum**. Finishers still keep their printed total Cost and any standing/grounded, sequence, body-damage, search, discount, submission, or other play conditions; only Strength / Strike / Agility / Technical requirements are prohibited.

### Global Finisher rule
- Every active Finisher now has `requirements: {}`.
- The match engine defensively skips Method-requirement checks for Finishers, even if stale/custom card data attempts to provide one.
- Finisher Counters receive the same protection, so a Finisher used through a Counter mechanic cannot be Method-gated.
- Deck Lab eligibility ignores Method requirements on Finishers.
- Live card presentation and Card Art Studio never render a `REQUIRES` Method line for Finishers.
- Rebuild validation now fails if any active Finisher contains a Method requirement.
- Dedicated automated regression coverage ensures both the card pool and engine keep this rule intact.

### Corrected cards
The audit found 13 active Finishers carrying legacy Method requirements. Their Cost, Damage and other locked mechanics are unchanged; only the Method requirement was removed:

- **Spear** — shared Evolution Finisher
- **Figure-Eight Leglock** — Charlotte Flair
- **Breakker’s Spear** — Bron Breakker
- **Claymore** — Drew McIntyre
- **RKO** — Randy Orton
- **Punt Kick** — Randy Orton
- **Helluva Kick** — Sami Zayn
- **Moonsault** — Jacob Fatu
- **Tongan Death Grip** — Jacob Fatu
- **Samoan Spike** — Solo Sikoa
- **Jaded** — Jade Cargill
- **Annihilator** — Nia Jax
- **Jackhammer** — Goldberg

No Superstar Momentum distribution was changed to compensate for a Finisher requirement. In particular, **Sami Zayn remains on his locked Momentum distribution; Helluva Kick simply has no Method requirement, as intended.**

### Balance audit after correction
The corrected full roster was rerun before any character-specific buffs or nerfs:
- Deterministic standard pass: **4,900 matches / 0 stalls / 36.40 average turns**.
- Finish distribution: **3,931 pins / 655 submissions / 314 turn-limit draws**.
- Health-gated pin attempts remain clean: **0 Green / 0 Amber / 9,129 Red**.
- Extended balance pass: **14,700 matches / 0 stalls / 36.46 average turns**.
- Extended finish distribution: **11,987 pins / 1,815 submissions / 898 turn-limit draws**.
- Starting-side imbalance remains present in the extended pass: **P1 42.4% / P2 51.5% / draws 6.1%**. This was not altered in v0.12.11 and remains a separate balance-pass item.

The extended corrected data still shows major Superstar outliers, so no character-specific balance changes were bundled into this rules correction. That keeps the next tuning decisions based on a clean Finisher ruleset.

### Validation
- **89/89 automated tests pass**.
- **50 Superstars / 50 complete recommended decks**.
- **422 gameplay cards / 472 collector-manifest cards**.
- **51 active Finishers / 0 with Method requirements**.
- **0 orphan cards / 0 rebuild issues**.
- Card-ID audit clean.
- Flow audit clean.
- Card Art Studio data regenerated for the corrected card pool.
- No card numbering, booster contents, Superstar HP, printed Finisher Costs/Damage, deck sizes or locked character abilities were changed.
