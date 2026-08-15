# WWE Legacy v0.12.42 — Submission + Persistent Injury Cleanup

v0.12.42 supersedes v0.12.41.

## Submission card cleanup

- The v0.12.41 current-HP/persistent-body-damage engine remains the canonical Submission system.
- All **24 genuine Submission holds now have printed HP Damage 0**. A hold only adds its persistent body-part damage.
- **Blockbuster** and **Ultimate Warrior’s Diving Shoulder Block** are no longer falsely classified as Submission cards; both are Aerial impact Moves.
- **Bearhug** now targets Chest (P4) and is standing-only.
- **Abdominal Stretch** now targets Chest (P3) and is standing-only.
- **Octopus Hold** is P4 and standing-only.
- Grounded/standing requirements are now enforced for Submission cards. Existing non-submission standing metadata is deliberately not globally changed in this pass.
- The CPU now values Submission Finishers according to applications-to-tap rather than treating a fresh zero-HP-damage Submission Finisher as automatic best offense.

## Persistent weapon / environment injury

Weapon/foreign-object impacts add one-shot persistent body-part damage in addition to their normal HP effects where applicable:

- Ringpost → Head +1
- Steel Steps → Back +1
- Steel Chair to the Back → Back +1
- Belt Whip → Back +1
- Loaded Mask Headbutt → Head +1
- Brass Knuckles → Head +1
- Hammer in the Boot → Head +1
- Jar of Teeth → Head +1

Steel Plate remains a weapon setup Special; its injury is represented by Loaded Mask Headbutt rather than being applied twice.

## Certification

- Automated tests: **196/196 passed**.
- Validation: **50 Superstars / 50 decks / 432 gameplay cards / 0 orphans / 0 issues**.
- Card-ID audit: **0 issues**.
- Flow audit: **0 issues**.
- Counter-chain audit: **2,450 matches / 0 stalls / 727 depth-2+ exchanges / 0 non-Punch/Elbow depth-2+**.
- Standard balance simulation: **2,450 matches / 0 stalls / 25.18 average turns / 2,269 pins / 181 submissions**.
- Deep simulation: **24,500 matches / 0 stalls / 25.20 average turns / 25 median / 93.9% pin / 6.1% submission**.
- Deep Submission activity: **7,924 declarations / 8,003 maintains / 1,505 tap-outs**.
- Card Art Studio regenerated: **482 collectibles / 50 Superstars**.

No Superstar HP, deck composition, pin curve, retained-Control draw, Momentum, Entrance, Adrenaline or counter-terminal rules were changed in v0.12.42.
