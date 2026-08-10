# WWE Legacy v0.11.11 — 33-Failure Regression Audit

Starting point: v0.11.10 reported **130 passed / 33 failed** under `node --test`.

Final result: **163 passed / 0 failed**.

Of the 33 original failures, **28 were stale tests/fixtures** and **5 exposed genuine consistency failures across four root causes**. No dormant cards or retired mechanics were restored merely to satisfy old assertions.

| # | Original failure | Disposition |
|---|---|---|
| 1 | Move costs are thresholds / never spent | Stale fixture — Cross Rhodes now costs 9; test now funds the current gate. |
| 2 | Original-style Move Type separate from Momentum method | **Genuine data fix** — Curb Stomp explicitly restored to Standing Above. |
| 3 | Every collectible resolves to local artwork | Stale pool count — active pool is 372 after v0.11.8 cleanup; all 372 still resolve locally. |
| 4 | Submission maintained by ditching one page | Stale Anaconda Vise Momentum fixture. |
| 5 | Releasing a submission keeps control | Stale Anaconda Vise Momentum fixture. |
| 6 | Undertaker draws when a cost-6+ Move is Countered | Obsolete ability — rewritten for current Deadman Walking survive-at-one comeback. |
| 7 | Kane reduces High Risk / ignores first Stun | Obsolete ability — rewritten for current Big Red Machine 8+ damage connection reward. |
| 8 | Successful pin ends match | Stale Cross Rhodes Momentum fixture. |
| 9 | Maintained submissions build pressure / win | Stale Anaconda Vise cost and old pressure amount; now asserts current printed submission pressure. |
| 10 | Fighting Spirit / Crowd Connection | Stale expected damage after centralized reviewed damage normalization. |
| 11 | Signature Moves need no old setup | Stale Cody Cutter total Momentum fixture. |
| 12 | SummerSlam has 130+ Moves | Pre-cleanup assertion — active audited pool is 135 cards / 101 Moves. |
| 13 | Recommended decks respect five-copy cap | **Genuine deck fix** — IYO SKY Agility and Paige Technical were each six copies including Lead Off; corrected while preserving 55 pages. |
| 14 | Recommended decks satisfy deck-health floors | **Genuine consistency fix** — Deck Lab floors were still from the old utility-heavy architecture. |
| 15 | Optimize Deck preserves legal shape | **Same genuine root cause as #14** — optimizer now scores against reviewed offense-forward targets. |
| 16 | Hall of Fame set size | Pre-cleanup assertion — active audited pool is 106. |
| 17 | Manager uniqueness/restrictions | Stale Paul Bearer restriction — current reviewed design is Undertaker only. |
| 18 | Bobby Heenan after Andre Counters | Stale Manager behavior — current Heenan protects Andre's important Move when Andre's Move is Countered. |
| 19 | Stone Cold Kick searches Stunner | Stale printings — test now uses active reviewed Kick/Stunner IDs and current gates. |
| 20 | Move draw/discard/Attitude effects | Stale card examples — rewritten around active shared Arm Drag, Snapmare and Running Forearm effects. |
| 21 | Miss Elizabeth half-HP trigger | Stale effect — current design draws 2 then bottoms 1; it does not heal. |
| 22 | Paul Bearer after Undertaker Power Move | Stale trigger — current design triggers below half HP and recovers a card or grants Urn momentum. |
| 23 | Evolution has 172 cards | Pre-cleanup assertion — active audited pool is 110 / 78 Moves. |
| 24 | Evolution named card count >=32 | Pre-cleanup count — now validates every active linked Entrance/signature against each Superstar. |
| 25 | CPU maintains near-tap submission | Stale Guillotine Momentum/posture fixture. |
| 26 | European Uppercut counter-attack | Stale defender Momentum fixture. |
| 27 | Rhea counter-to-counter | Stale fixture plus obsolete assumption that Ripcord Knee is Leg Extended; current active Enzuigiri supplies the legal Leg Extended response. |
| 28 | CPU never releases Finisher submission | Stale Figure Eight Agility fixture. |
| 29 | Final Boss Rock persona | Stale Sharpshooter signature assertion — Sharpshooter is intentionally dormant; current three signature IDs remain active. |
| 30 | Full collectible counter audit | Pre-cleanup numeric thresholds — now audits every active counter Move and derives expected gate counts from the pool itself. |
| 31 | Generic techniques are shared | Pre-cleanup membership — active shared techniques remain shared; pruned duplicates are explicitly asserted dormant. |
| 32 | Punk specialist defensive package | Stale count — reviewed offense-forward Punk deck intentionally carries one Chain Wrestling and one Duck. |
| 33 | `tools/orientation-test.mjs` | **Genuine diagnostic robustness fix** — added a safe default subject for test discovery. |

## Post-fix validation
- `npm test`: **163/163 pass**.
- `node tools/full25-cert.mjs`: **0 issues**.
- `node tools/legal-pass-audit.mjs`: **0 passes with a legal offensive Move**.
- `npm run flow`: all audited dead-offense rates remain below 20%.
- `npm run economy`: completes for all three Featured sets.
- `npm run art`: **372/372 active collectibles** resolve to local artwork.
- `npm run balance`: **7,500 matches, 0 stalls, 41 draws**.
- Full 25-Superstar 10,000-match matrix: **0 stalls, 46 draws**.
