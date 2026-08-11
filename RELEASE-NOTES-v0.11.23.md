# WWE Legacy: Collectible Card Game — v0.11.23
## Core Wrestling Fundamentals + Card Art Studio Sync

This release stabilizes the Season 1 active card vocabulary before the large custom-art production pass.

### SummerSlam foundation
Seventeen genuinely common wrestling techniques are now active as shared SummerSlam — Series 1 cards. They are appended after the previously locked pool, so **every existing collector number remains unchanged**.

- SS1-136 — Punch
- SS1-137 — Front Kick
- SS1-138 — Stomp
- SS1-139 — Hip Toss
- SS1-140 — Elbow Drop
- SS1-141 — Knee Drop
- SS1-142 — Leg Drop
- SS1-143 — Vertical Suplex
- SS1-144 — Russian Leg Sweep
- SS1-145 — Bulldog
- SS1-146 — Sleeper Hold
- SS1-147 — Irish Whip
- SS1-148 — Knife-Edge Chop
- SS1-149 — Drop Toe Hold
- SS1-150 — Fireman's Carry
- SS1-151 — Schoolboy
- SS1-152 — Small Package

The eight SummerSlam recommended decks now seed these fundamentals through normal deck usage so the cards remain booster-active rather than existing as dead definitions.

### Punch family
`Punch` is now the shared baseline at Cost 2 / Damage 4 / 1 Strike. Wrestler-specific punches remain separate collectibles under the `punch` move family and are deliberately better through extra damage, an effect, or substantially stronger signature-level numbers.

The old generic Final Boss Rewards `Punch` has become **Final Boss Right Hand**, a Rock-specific punch-family card at Cost 2 / Damage 5 / 1 Strike. Existing Rewards collector order is preserved.

### Card Art Studio
The Studio is regenerated from the new live active pool: **389 collectibles / 278 Moves**. The new SummerSlam fundamentals appear as SS1-136–SS1-152 with live COST, DAM and method-requirement data.

The Superstar filter from v0.11.22 remains intact, including both Superstar-specific and full-recommended-deck scopes.

### Finished-art filename synchronization
A workflow mismatch discovered during this audit is fixed before bulk art production. The Studio exports non-Superstar cards with stable collector-coded filenames such as:

`assets/cards/art/custom/moves/ss1-136-punch.webp`

The game now resolves that same canonical filename via `finished-front-keys.js`. For backwards compatibility it also retries the older raw-ID filename if a previously created WebP exists there.

### Certification
- 179 automated tests passed / 0 failed
- 389 / 389 active collectibles resolve to local fallback artwork
- 25-Superstar certification: 0 issues
- AI legal-pass audit: 0 passes while legal offense existed
- 10,000-match matrix: 0 stalls, 46 draws
- Seeded matrix win-rate range: 44.6%–57.1%
