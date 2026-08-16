# WWE Legacy CCG — v0.12.33
## Retained-Control Draw + Roster Rebalance

v0.12.33 supersedes v0.12.32 as the current working baseline.

### Core match-flow correction
- A connected non-Submission Move still retains Control.
- The new retained-Control turn still refreshes the controller's normal **one Momentum placement**.
- On that retained-Control turn, **only the defender draws 1 page**.
- The attacker no longer receives an automatic replacement page for the Move they just spent.
- Normal Control transfers (pass, successful Counter, failed pin/kickout and other existing transfer paths) retain their normal global turn draw behavior.
- The successful-Move Adrenaline economy is unchanged: **attacker +1 / defender -1**.
- v0.12.32 Entrance timing is unchanged: Entrance Momentum is preloaded before the bell; Entrance Adrenaline resolves once on that Superstar's first actual Control.
- v0.12.30 comeback/rubber-band rules remain rejected and are not present.

### Why this changed
The possession audit showed the runaway loop was not one Momentum per turn by itself. Under the old retained-Control model the attacker could connect, retain Control, lay another permanent Method Momentum **and immediately replace the spent Move with a draw**, while the defender could only accumulate cards without playing Momentum. Removing only the attacker's retained-Control replacement draw preserves defensive replenishment while making long offensive sequences consume real hand resources.

### Roster rebalance for the corrected engine
The roster has been retuned against the new hand-flow model rather than preserving numbers calibrated for the old double-draw loop.

Notable changes include:
- André remains HP 71; Giant's Reach is +5 Damage (3 triggers), and The Eighth Wonder is +2 Adrenaline. Sitdown Splash remains C11/D18.
- Rock HP 76; Goldberg HP 74. The prestige/reward tier remains intentionally above the normal roster.
- Logan Paul HP 55; Jacob Fatu HP 60 and Built Different is +1 Adrenaline with no draw.
- Liv Morgan HP 67; Liv Forever now gives draw 1 +1 Adrenaline on its first two successful Counters; Revenge Tour also draws 1.
- Jey Uso HP 68 and YEET! discounts Uso Splash by 3.
- Alexa Bliss HP 65; Sister Abigail discounts Twisted Bliss by 3 and Twisted Bliss is C8.
- Undertaker HP 68 with restored Old School → Chokeslam → Tombstone route.
- Hogan's Real American gives +2 Adrenaline on first Control; Hulkamania also draws on its first two qualifying Strength connects.
- Paige's Anti-Diva draws 1 on its first two qualifying Strike connects.
- Charlotte's Genetically Superior is capped at one trigger.
- Chad Gable's Ankle Lock and Jacob Fatu's Tongan Death Grip are Pressure 5.
- Tiffany's Handspring Back Elbow now discounts PME by 3.
- Damian Priest's South of Heaven now searches Hit the Lights.
- Goldberg's Streak begins at 5+ Damage; Military Press Powerslam searches/discounts Spear; 173–0 draws 1.

### Certification
Final 24,500-match deep roster benchmark:
- **0 stalls**
- **26.97 average turns / 27 median**
- **Winner HP: 26.4% average / 22.0% median**
- **Loser HP: 13.1% average**
- **P1 win rate: 48.99%**
- **80.3% pin / 19.7% submission / 0% decision**
- André: **55.7%**
- Rock: **70.8%**
- Goldberg: **70.6%**
- Highest normal-roster result: Logan Paul **60.4%**
- Lowest normal-roster result: Mankind **39.8%**

Quality gates:
- **164/164 automated tests pass**
- Validation: **0 issues**
- Card-ID audit: **0 issues**
- Flow audit: **0 issues**
- Counter-state audit: **0 issues**
- Counter-chain audit: **0 non-Punch/Elbow cards at depth 2+**
- Standard 2,450-match balance run: **0 stalls / 27.15 average turns**
- Card Art Studio regenerated from current data.
