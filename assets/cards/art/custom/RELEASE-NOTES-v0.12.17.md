# WWE Legacy: Collectible Card Game — v0.12.17

## Counter-State + 60-Page Deck Expansion

v0.12.17 builds on the phone-verified v0.12.16 match-flow baseline and expands defensive interaction without reintroducing dead-turn chains.

### Eight universal counter states
Every Move is assigned exactly one physical counter state:
- **Arm Extended**
- **Leg Extended**
- **Running Aerial**
- **Diving Aerial**
- **Body Elevated**
- **Torso Trapped**
- **Front Control**
- **Rear Control**

The state describes the physical setup of the incoming Move rather than simply copying its Method. The full Move pool was audited after the initial inference pass and explicit corrections were added for ambiguous legacy cards such as 619, Forearm Smash, Running Forearm, Diving Shoulder Block, Blockbuster, Old School, Cody Cutter, Sol Snatcher, Diamond Dust, Middle-Rope Stunner, Jersey Codebreaker, Bullet Train Attack, Annihilator, standing aerials and attacks delivered to the back.

### New state-based reversals
Counter legality now understands `counterStates` in addition to the legacy broad-family and exact-card mechanisms. Initial anchor reversals are:
- **Punch** → Arm Extended
- **Drop Toe Hold** → Leg Extended
- **Dropkick** → Running Aerial
- **Knees Up** → Diving Aerial
- **Hurricanrana** → Body Elevated
- **Headbutt** → Torso Trapped
- **Arm Drag** → Front Control
- **Back Elbow** → Rear Control

Additional intuitive overlaps include Dragon Screw, Back Body Drop, Reverse Elbow, Knee to the Gut, Hip Toss, Sidestep, Duck, Chain Wrestling, No Sell, Leapfrog, Elbow, Backstabber and Tilt-a-Whirl Headscissors.

### Submission response layer
Submission Moves receive both:
1. one of the eight universal counter states for the initial application; and
2. a body-area target: **Arm / Leg / Back / Neck-Head**.

Body-area submission reversals are wired for Arm Drag, Dragon Screw, Back Elbow and Chain Wrestling while the existing submission wear-down/tap rules remain intact.

### New card: Knees Up
- `SS1-136` — **Knees Up**
- Common / Cost 2 / Damage 0 / Agility 1
- Defensive reversal for **Diving Aerial** attacks.
- Added to the collector manifest, Collection and Card Art Studio data.

### Recommended decks are now 60 pages
- All **50 recommended decks** are exactly **60 pages**.
- The global baseline remains **12 Momentum**, leaving 48 non-Momentum pages.
- The five additional slots were used primarily to improve counter/reversal access with low-cost pages that remain useful during ordinary play.
- Every recommended deck now contains at least **7 counter-capable pages**.
- Counter density remains identity-sensitive rather than being forced to the same number for every Superstar.
- Untouched saved v0.12.16 recommended 55-page decks migrate automatically to the matching 60-page list; custom 55-page Deck Lab edits are not silently overwritten.

### Match-hand quality of life
Normal ACTION hand order is now:
1. playable Momentum;
2. playable Actions / Specials;
3. playable Moves, highest Damage to lowest;
4. other/unplayable pages.

During Counter or Pin Response windows, valid response cards jump to the front.

### Pin-escape presentation
Pin-escape Specials now interrupt the pin with a dedicated **SHOULDER UP!** spectacle and display the actual Special card before returning to the match.

### Certification
- Automated tests: **111/111 pass**.
- Counter-state audit: **305/305 Moves categorized; 26/26 Submission Moves have body-area targets; 0 issues**.
- Rebuild validation: **50 decks / 423 gameplay cards / 0 orphans / 0 issues**.
- Collector ID audit: **473/473 clean**.
- Flow audit: **50 Superstars / 0 issues**.
- Economy simulation: **60 packs / 300 cards / 0 Entrance leaks / 0 foil-first failures**.
- Balance simulation: **2,450 matches / 0 stalls / 15.23 average turns**.
- Extended balance: **4,900 matches / 0 stalls / 15.38 average turns**.
- Dead-turn audit: **0.97 pass decisions per match; 0/2,450 matches with a 4+ consecutive-pass streak; maximum streak 3**.

This build changes defensive interaction substantially, so roster win-rate tuning should continue from real phone play and dedicated balance passes rather than treating the counter expansion itself as final balance certification.
