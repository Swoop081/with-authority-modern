# WWE Legacy v0.12.97 — Foil Preference + Premium Duplicate Value

This pass keeps Foils gameplay-neutral while making them the preferred collector finish in Deck Assistance and more valuable when duplicated beyond the ownership cap. The My Legacy Rulebook remains fully integrated.

## Cosmetic-only Foils

- Foil cards are now collector / presentation variants only.
- Normal and Foil copies have identical **Cost, Damage, Method requirements and effects**.
- Printed numbers on finished card artwork are therefore always the real base gameplay numbers.
- Saved Foil deck entries still display with Foil treatment in Deck Lab and matches.
- Deck Assistance no longer recommends a Normal → Foil swap as a gameplay improvement and no longer describes Foils as `+1 Damage`.
- A genuine recommended-build restoration may still use a newly owned Foil copy, but only because the card itself belongs in the authored build—not because Foil is stronger.

## My Legacy — Rules & How to Play

My Legacy now includes a dedicated Rulebook route with a quick navigation menu and expandable sections covering:

- winning, health and match basics
- turns, Control and drawing
- Strength / Strike / Technical / Agility Momentum and Adrenaline
- card types, Entrances, Specials, Supports and Managers
- Move Cost, Method requirements, position and Superstar restrictions
- the eight Counter States, counter-attacks, exchange exceptions and Auto Counter
- damage, grounding, Stun and persistent body-part damage
- Amber / Red pin legality and the exact actual-HP pin probability table
- Submissions, maintaining holds and current-HP tap thresholds
- 60-page Deck Lab construction, Lead Off 5 and copy caps
- rarity policy, ownership and cosmetic-only Foils
- booster collation, Superstar chase, duplicates, UP and Deck Assistance
- Exhibition, Daily Live Events, Climb the Ladder and Championship Road
- Season 1's 100 tiers, Challenges, free booster and release-gated rewards
- career records, achievements, local saves and the core glossary

Specific authored card / Superstar text remains able to create explicit exceptions to the general Rulebook for that interaction.

## Certification

- **386/386 regression tests pass**
- Validation: **50 Superstars / 50 decks / 438 gameplay cards / 0 orphans / 0 issues**
- Flow audit: **50 Superstars / 0 issues**
- Card-ID audit: **488/488 / 0 issues**
- Counter-state audit: **438 gameplay cards / 318 Moves / 0 issues**
- Economy smoke audit: **60 packs / 300 cards / 0 duplicate Entrance pulls / 0 foil-first failures**
- Known art backlog: **451 unfinished custom fronts**


## v0.12.97 — Foil Preference + Premium Duplicate Value
- Deck Assistance now prefers an owned Foil copy whenever it chooses which finish of a card to place into a saved deck. This is presentation-only; Normal and Foil gameplay values remain identical.
- If a pack card is already used as Normal and an unused owned Foil copy exists, Deck Assistance can offer a Foil Preference swap without changing deck composition or gameplay strength.
- Excess Normal copies still convert for 10 UP. Excess Foil copies now convert for 20 UP once that card's Foil ownership is already at its cap.
- Rulebook copy updated to document Foil preference and the 10 UP / 20 UP duplicate conversion values.


## v0.12.97 — CPU Submission Cadence Hotfix
- Fixed an intermittent CPU submission bug where the AI could ignore its intended hold-length cap whenever it had enough hand pages to mathematically force a tap. Because CPU decisions resolve synchronously, this could burn 5–10+ pages through one hold before the UI rendered again and create an apparent instant tap from high HP.
- CPU normal holds are now capped at 2 total pressure ticks per application (initial + one maintain). CPU Trademark and Finisher holds are capped at 3 total pressure ticks (initial + two maintains), even when the CPU has enough cards to finish.
- Persistent body-part damage remains unchanged: later applications can still force a tap when accumulated damage reaches current HP.
- Submission pressure values, player-controlled submission behavior, card data, HP and match rewards are unchanged.


## v0.12.97 — Submission Defender Response Window
- CPU-applied Submissions now stop after the initial pressure tick and enter a defender response window before any maintenance pressure can resolve.
- Human defenders see an explicit **YOU ARE IN THE HOLD** panel with current body-part damage versus current HP and a **PASS · CONTINUE HOLD** action.
- Every CPU maintenance tick that does not tap the defender returns to another human response window, preventing synchronous CPU decision bursts from visually skipping directly from Submission Locked to Tap Out.
- Immediate tap-outs remain legal only when the initial application itself reaches the persistent body-part damage threshold against current HP.
- Prism Trap is covered by a dedicated 33 HP regression test.


## v0.12.97 — Multi-Tower Live Events + Store Economy Pass
- Live Events is now the first Play path and is labeled DAILY TOWER on the Play menu. EVENTS uses the same green accent as the Enter Live Events CTA and the daily slot explicitly resets every day.
- Entering Live Events now opens a dedicated hub containing simultaneous limited-time towers instead of dropping directly into a single event. The hub always carries a Daily Tower, a 3 Day Tower and a Weekly Tower with independent countdowns and progress.
- The Daily Tower retains the Monday RAW / Wednesday NXT / Saturday SmackDown schedule and original WWE Legacy identities on the other days. Three-day and weekly themed towers rotate from authored pools including Submission Specialists, High Risk Showcase, Fight Night, Giants & Monsters, Legends Collide, Champions Clash, Method Masterclass and Evolution Showcase.
- Birthday challenges can appear for 24 hours only. Brock Lesnar's birthday challenge is authored for July 12 and ends with Brock as the tower boss when possible.
- Tower progression is stored independently per live-event key, so completing or losing progress in one active tower does not affect another. Losses still retry the current stage.
- The individual tower detail screen removes repeated hero information: only Matches and UP Earned remain in the hero summary, reward information moves into the tower body, and Powerhouse Collision anchors a substantially larger Brock render above the UP Earned area. Opponent progression uses readable Superstar cards.
- Superstar purchases in the Daily Store now cost 2,500 UP instead of 1,200 UP. Booster price remains unchanged.


## v0.12.97 — Released-Roster Birthday Bashes + KO Pop-Up Powerbomb
- Birthday Bash events now cover exactly the 24 currently released launch-roster Superstars. Future authored Superstars remain excluded until their sets are promoted live.
- Each birthday event is named `<Superstar> Birthday Bash`, lasts 24 hours on that Superstar's real calendar birthday, and forces the birthday Superstar into Challenger 5.
- Pop-Up Powerbomb (SS1-088) is now a Kevin Owens-exclusive Rare (3★) Trademark at Cost 7 / Damage 12 / Strength 3. Its back text now reads as a KO Trademark and retains the Stunner search/draw with a 4-Cost discount this Control sequence.
- Oba Femi no longer uses Pop-Up Powerbomb; his two copies are replaced by generic Powerbomb so all authored decks remain legal.
