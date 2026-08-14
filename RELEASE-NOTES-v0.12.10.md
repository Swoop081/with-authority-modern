# WWE Legacy: Collectible Card Game — v0.12.10
## Season 2 — Who’s Next? Reward Pass

v0.12.10 builds the locked **Season 2 Reward Superstar Goldberg — “Who’s Next?”**, focused specifically on the WCW 1997–98 undefeated-streak persona. Goldberg is future Season 2 prestige content; **Season 1 remains active and The Rock — Final Boss remains its Tier 50 reward.**

### Goldberg — Who’s Next? — LOCKED
- Prestige/chase Season 2 reward, deliberately designed with a slightly higher ceiling than Season 1 Final Boss Rock while using a different snowball identity.
- HP **58**.
- Method Limits: **Strength Unlimited / Strike Unlimited / Agility 2 / Technical 1**.
- Starter Momentum: **Strength x6 / Strike x6**.
- Entrance **Who’s Next?**: begin with **+2 Strength Momentum, +2 Strike Momentum and +2 Adrenaline**.
- Ability **The Streak**: each connected Move dealing 6+ Damage builds 1 Streak counter, maximum 3. Each Streak counter reduces Goldberg’s Trademark/Finisher cost by 1 while he retains Control. Losing Control breaks the Streak and clears the counters.
- Special **173–0**: once per match when Goldberg’s Move is Countered, the Counter still resolves normally, but Goldberg retains Control, preserves his Streak counters and gains +1 Adrenaline.
- Trademark **Military Press Powerslam** — **C7 / D12 / Strength 3**; standing opponent, grounds; gains an additional Streak counter on connect.
- Trademark **Goldberg’s Spear** — **C8 / D13 / Strength 2 + Strike 2**; standing opponent, grounds; searches/draws Jackhammer and discounts it by 3 this Control sequence. With 2+ Streak counters before declaration, the opponent also loses 1 Adrenaline.
- Finisher **Jackhammer** — **C11 / D19 / Strength 4**; standing opponent, grounds; the Spear setup and Streak discounts stack.
- **No Pin Bonus** mechanics are present.

### Full reward deck
- Goldberg has an authored **55-page recommended deck with exactly 12 Momentum**.
- Momentum is exactly **Strength x6 / Strike x6**.
- The deck is built around authentic WCW-era impact/power offence and the locked prestige sequence rather than adding unrelated method coverage.
- The reward package is registered as a full-deck Season 2 completion reward for future progression/store handling.

### Reward protection
- Season-exclusive reward sets are now explicitly rejected by booster eligibility.
- This protects both **Season 1 Final Boss Rock** and **Season 2 Who’s Next? Goldberg** from accidental booster-pool leakage.
- Goldberg remains future/development content and does not replace Rock in current Season 1 progression.

### Collector numbering and Card Art Studio
- **S2WN-001** — Military Press Powerslam
- **S2WN-002** — Goldberg’s Spear
- **S2WN-003** — Jackhammer
- **S2WN-004** — Who’s Next? Entrance
- **S2WN-005** — 173–0 Special
- **S2WN-006** — Goldberg Superstar
- Card Art Studio includes a dedicated **Season 2 Rewards / Who’s Next?** set identity using a premium black / gold / steel reward treatment and the established Rewards mark.
- Studio generated data now contains **50 Superstars and 472 collector cards**.

### Engine implementation
- The Streak counter state is live in the match engine and shown in Goldberg’s HUD ability status as **0–3 STREAK**.
- Streak cost reductions are calculated by the central move-legality engine for Trademarks and Finishers.
- Military Press Powerslam’s extra Streak counter, Spear’s pre-declaration 2+ Streak check, Jackhammer tutor/discount chain, Streak break on lost Control, and 173–0 Counter-retention path are all executable engine mechanics rather than text-only effects.
- Dedicated regression coverage tests both defensive Counter retention and the stacked Spear → Jackhammer discount.

### Validation
- **88/88 automated tests pass.**
- **50 Superstars / 50 complete recommended decks.**
- **422 gameplay cards / 472 collector-manifest cards.**
- **0 orphan cards / 0 rebuild issues.**
- Card-ID audit clean, including gap-free **S2WN-001 through S2WN-006**.
- Flow audit clean.
- Deterministic full-roster simulation: **4,900 matches, 0 stalls, 36.47 average turns, 3,904 pins, 671 submissions, 325 turn-limit draws**.
- Pin attempts remain health-gated: **0 Green, 0 Amber, 9,103 Red attempts**.

### Balance note
Goldberg finished the deterministic pass at **84.2% wins**, narrowly above **The Rock at 83.7%**, which matches the locked intent that the Season 2 chase reward should slightly surpass the Season 1 reward in ceiling. No locked Goldberg values were silently changed during packaging.
