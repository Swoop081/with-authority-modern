# WWE Legacy v0.12.41 — Persistent Body-Part Submissions

v0.12.41 replaces the old Max-HP-derived submission threshold with a persistent body-part damage system tied directly to the defender's **current HP**.

## Locked submission rule

- Head / Arms / Legs / Back / Chest damage persists for the entire match.
- `submissionThreshold(player)` is now exactly the player's current HP.
- A successful submission application or maintain causes a tap immediately when damage on that targeted body part is greater than or equal to current HP.
- The former artificial “tap-outs begin on Submission Turn 3” gate is removed.
- Releasing a hold never clears body-part damage.
- Normal Move HP damage can lower the threshold later, making an already-worked body part more vulnerable when a submission is reapplied.
- Body-part damage alone does not cause an automatic tap while no submission is applied; a successful submission application/maintain must still trigger the finish.

## Example

At 50 current HP, a +5 Head submission starts at 5 / 50. Holding it for three successful turns banks 15 Head Damage, then the wrestler can release and keep that 15 for later. If the opponent later falls to 20 HP, another +5 application reaches 20 Head Damage and can force the tap immediately.

For cards such as Anaconda Vise that also deal printed HP damage on connect, that HP damage resolves before the submission comparison, so the live threshold can become even lower on the application that locks the hold in.

## CPU submission intelligence

- The CPU always uses a legal matching reversal when available.
- Low/mid submission threats are now evaluated by successful applications remaining to a tap.
- A submission within two applications of a tap is treated as an Auto Counter emergency; at 15 HP or less, a three-application threat is also treated as critical.
- The CPU values submissions much more highly when persistent damage makes the targeted body part close to the opponent's current HP.
- It prefers an immediately tapping submission, or a two-application submission when appropriate, over a mediocre pin attempt.
- A CPU attacker may maintain an early Trademark/Finisher hold for up to three successful turns to bank persistent body-part damage even when a finish is not currently possible, while preserving enough hand to continue the match.
- If the CPU can mathematically finish the submission with its remaining pages, it commits to the hold.

## UI

The submission panel now reads the matchup directly as body damage versus current HP, for example `5 / 50 HP TO TAP`, labels the damage as persistent, and explains that releasing the hold does not heal the body part.

## Unchanged

All v0.12.40 gameplay outside submissions remains intact, including the actual-HP pin curve, retained-Control draw model, +1/-1 Adrenaline shift, Counter terminality, Punch/Elbow exchange exception, Momentum, Entrance timing, roster/deck data, and featured-card menu restoration.
