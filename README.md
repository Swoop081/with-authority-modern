# With Authority Modern — v0.4.5

Clean static browser wrestling/card game engine built from scratch. The original With Authority files are reference material only; this project does not reuse the old mobile recreation code.

## Two collectible sets

The game now has **338 collectible cards across 16 Superstars**. Owned compatible cards from either set enter one global deck-building collection.

### SummerSlam — Series 1

171 cards · 8 Superstars · 139 Moves

- Cody Rhodes
- CM Punk
- Roman Reigns
- Seth Rollins
- Oba Femi
- Brock Lesnar
- Kevin Owens
- Gunther

A new save still begins by choosing **CM Punk or Roman Reigns**. The selected Champion and their connected 55-card starter package are unlocked first.

### Hall of Fame — Series 1

167 cards · 8 Superstars · 133 Moves

**Golden Era**

- Hulk Hogan
- André the Giant
- Randy Savage
- Ultimate Warrior

**Attitude Era**

- Stone Cold Steve Austin
- The Undertaker
- Mankind
- Kane

Hall of Fame uses a separate booster pool and separate collection/milestone progress, while its owned cards can still be used in compatible decks alongside SummerSlam cards.


## PRE-MATCH Entrances and Superstar abilities

Entrances now resolve automatically **before the bell** for both wrestlers. Each linked five-card Lead Off package begins with its unique Entrance; PRE-MATCH resolution removes that Entrance to discard, applies/registers its effect, and leaves four fixed Lead Off pages. Opening Control is then determined, the bell rings, and the starting wrestler draws one shuffled page. Turn 1 therefore begins with **4 fixed Lead Off pages + 1 random page**. The non-starting wrestler draws their fifth page when they first gain Control.

Entrance effects may be immediate, delayed, recurring or conditional. Examples include starting Ability Momentum, Turn 5/6/10 rewards, every-N-turn effects, and later comeback triggers. Scheduled Entrance effects remain registered after the Entrance card itself leaves play.

Superstar abilities remain tied directly to the Superstar card and are separate from Entrances. The engine now supports:

- once-per-match triggered abilities
- limited multi-use abilities
- turn-triggered abilities
- passive abilities
- triggers from connected Moves, damage taken, successful Counters, or having an expensive Move Countered

Examples include Punk gaining Technical Momentum on his first successful Counter, Undertaker drawing after selected expensive Moves are Countered, and Kane passively reducing High Risk damage while ignoring his first Stun.

## Restored tactical Move Types

The original-style Move Type layer is restored as a separate system from Momentum methods. A Move now has both a **method** (Agility, Knowledge, Strength, Strike or Technical) and a tactical **Move Type** used for counters.

Supported Move Types:

- High Risk
- Scoop
- In Close
- Head Down
- Back to Foe
- Arm Extended
- Standing Above
- Mad Rush
- Leg Extended
- Behind Opponent
- Hit or Miss
- Victim Below
- Defensive

Known reference relationships from the original game are preserved, including Clothesline as **Strike / Mad Rush**, Arm Drag as **Technical / Arm Extended**, DDT as **Victim Below**, Dropkick as **Hit or Miss**, Headlock as **Back to Foe**, and Duck as **Defensive**. Offensive Moves may also reverse compatible incoming Move Types, so reversal play no longer depends primarily on dedicated counter-only cards.

Dedicated reversal-only pages are now limited to a small specialist package of three per recommended deck; ordinary offensive Moves provide most counter coverage.

## Rich Move effects

Moves are no longer primarily damage-only cards. The MatchEngine now resolves reusable secondary effects after a Move connects, including:

- draw pages
- opponent ditches pages
- gain extra Attitude or Ability Momentum
- remove opponent Momentum
- search the Playbook for a named card/Finisher
- HP recovery and temporary bonuses through the shared effect resolver
- existing stun, posture, submission and ringside effects

Current explicit-effect coverage:

- **SummerSlam:** 51 Move cards with secondary effect payloads
- **Hall of Fame:** 30 Move cards with secondary effect payloads

Examples include Stone Cold's **Kick to the Gut** searching the Playbook for **Stone Cold Stunner**, and high-impact Moves that draw, force discards or alter Attitude in addition to the normal connected-Move +1/-1 Attitude rule.

Secondary effects reward successful wrestling rather than adding extra setup-card prerequisites, preserving the Standing/On the Mat and Ring/Ringside flow model.

## Managers

Hall of Fame — Series 1 introduces a new persistent **Manager** card type.

- **Bobby Heenan** — André the Giant only. Once per match after André successfully Counters, draw 1 page and gain 1 Attitude.
- **Miss Elizabeth** — Randy Savage only. Once per match when Savage falls to half HP or less, recover 2 HP and draw 1 page.
- **Paul Bearer** — The Undertaker or Kane. Once per match after a qualifying 6+ damage Strength-method Move connects, draw 1 page and gain 1 Attitude.

Manager rules:

- unique collectible ownership cap of 1
- maximum 1 Manager in a deck
- maximum 1 active Manager in a match
- Superstar restrictions are enforced by MatchEngine, Deck Builder and deck-health validation
- the Manager remains active once played, but its signature ability triggers only once per match
- Manager cards count as utility in deck-shape evaluation

## Connected Superstar package

Each Superstar card owns a fixed five-card Lead Off package:

- exactly 1 linked Entrance
- 4 additional fixed Lead Off cards
- 50 editable deck slots

The five Lead Off card identities cannot be replaced in Deck Builder. Owned Foils can replace the corresponding Normal finish without changing the card identity.

### Entrance rule

Normal Entrance cards **never appear in boosters**. Unlocking a Superstar automatically grants their Normal Entrance. A Foil Entrance becomes booster-eligible only after that Superstar is unlocked; pulling it permanently replaces the Normal Entrance. Entrance ownership caps at one.

### Superstar-card rule

Superstar cards are unique one-copy collectibles. Pulling the Normal Superstar unlocks that wrestler and removes further Normal copies from the pool; one Foil Superstar can later replace the Normal copy.

## Booster economy

Each set has its own standard booster pool.

Standard pack:

- 5 cards
- 1 guaranteed Foil
- 50% Common / 30% Uncommon / 15% Rare / 5% Very Rare base rarity weights
- most cards cap at 5 playable copies across Normal + Foil
- at the five-copy cap, additional Foils replace Normals until the card reaches 5 Foils
- Normal Entrances are never booster pulls
- completed finishes leave their relevant booster pool

Set-specific Ladder and Championship Road rewards feed the matching set's booster credits.

### Superstar bad-luck protection

If 19 consecutive eligible standard boosters for a set fail to unlock a new Superstar, pack 20 guarantees a still-locked Superstar from that set. The counter resets when that set unlocks a Superstar.

## Single-player branches

### Climb the Ladder

Choose a path:

- **Current Era** — all 8 SummerSlam — Series 1 Superstars
- **Golden Era** — the 4 Golden Era Hall of Fame Superstars
- **Attitude Era** — the 4 Attitude Era Hall of Fame Superstars
- **Hall of Fame** — all 8 Hall of Fame — Series 1 Superstars

Mirror matches are allowed in these runs. Three lives are available; the third defeat ends the run. Rung wins award boosters from that branch's set. Clearing a path awards the corresponding Completion Pack, with first-clear Superstar protection where applicable.

### Championship Road

Championship Road also branches by era:

- **Modern** — final Championship match against CM Punk or Roman Reigns
- **Golden Era** — historical road culminating against Hulk Hogan or André the Giant
- **Attitude Era** — historical road culminating against Stone Cold Steve Austin or The Undertaker

Losses and draws retry the current stage rather than resetting the road. Wins and Championship Packs reward the branch's set.

## Deck Builder

- 55-card decks
- fixed connected Lead Off five
- edit the remaining 50 cards
- global cross-set owned-card pool
- owned-copy and five-copy enforcement
- Superstar and Manager legality checking
- shared deck-health/flow model
- Optimize Deck
- Reset Recommended
- Foil preference
- richer Move-effect value is included in optimizer/AI scoring

## Flow guard

The seeded 16-Superstar flow audit keeps mature 3+ Total Momentum dead-offense turns below 20%.

Current v0.4.5 baseline: **17.0%** dead-offense passes at 3+ Total Momentum. This remains below the 20% guard while preserving the restored Move-Type counter system and keeping defensive-only reversals out of normal CPU offense.

## Economy simulation

Run:

```bash
npm run economy
npm run balance
```

Current 300-trial **pack-only** baseline. It deliberately excludes Ladder, Championship Road, Challenge and milestone bonus packs.

### SummerSlam — Series 1

- second set Superstar: median 6 packs, p90 19
- fourth set Superstar: median 25 packs
- all 8 Superstars: median 72 packs
- 100% unique-card ownership: median 109 packs
- one Foil of every catalogue card: median 253 packs
- all cards at playable ownership cap: median 138 packs

### Hall of Fame — Series 1

- first Hall of Fame Superstar: median 6 packs, p90 19
- second Hall Superstar: median 14 packs
- fourth Hall Superstar: median 31 packs
- all 8 Hall Superstars: median 77 packs
- 100% unique-card ownership: median 87 packs
- one Foil of every Hall catalogue card: median 253 packs
- all cards at playable ownership cap: median 137 packs

See `tools/economy-report.txt` for the full simulation output.

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Certification

```bash
npm test
npm run flow
npm run economy
npm run balance
```

Current certification: **100/100 automated tests**. This includes all 240 non-mirror matchups across the 16-Superstar roster, all 16 mirror matches, both collection sets, era branches, set-specific boosters, richer Move effects, all three Manager abilities, and validation that every collectible Move has a legal Method / Move Type / counter definition.

### 3,072-match tactical balance audit

Run `npm run balance` for the full seeded report in `tools/balance-report.txt`. Opening Control alternates evenly in the audit so roster strength is not distorted by turn order; normal single-player matches randomize opening Control for the same reason.

Current headline results:

- 0 stalls
- P1 wins: **48.9%**
- P2 wins: **51.1%**
- average **17.52 turns**
- average **16.49 Control changes**
- **21.8%** of declared Moves are countered
- **96.3% pin finishes / 3.7% submission finishes**
- average winner HP **27.36** / loser HP **16.79**
- all 16 Superstars fall between **42.4% and 57.6%** win rate in the seeded audit

v0.4.5 adds the PRE-MATCH Entrance phase plus original-inspired scheduled and persistent Superstar identity effects. The final tuning keeps those new effects from creating runaway openings: Seth's Architect is a single first-new-Method draw, Austin's Superstar ability draws without stacking another Attitude bonus, and recommended Momentum mixes were adjusted while preserving the five-copy cap and free-flow guard.

The project remains a direct static GitHub Pages root.
