## v0.11.21 — URL Artwork Loader Fix

The unified Card Art Studio URL loader now gives immediate status directly under the URL button and automatically retries CORS/hotlink-blocked image hosts through the public `wsrv.nl` image proxy. Successful URL imports are converted into browser-memory data URLs before entering the preview canvas, preserving WebP export safety even when the Studio is opened directly from `file://`.

# WWE Legacy: Collectible Card Game — v0.11.19




## v0.11.19 — Unified Card Art Studio

**Profile → Card Art Studio** is now the single artwork workspace for the entire active Season 1 collection. It contains all **372 active collectibles** across SummerSlam, Hall of Fame, Evolution and Rewards, with filters for Superstar, Move, Entrance, Special, Manager, Action, Support and Momentum cards.

Every finished front uses the same premium full-art language: the set-specific background/frame, a small transparent set logo in the top-right, creator-supplied artwork, and a minimal bottom identity. Superstar fronts use the Superstar name only. Move fronts use the Move name plus compact `COST` / `DAM`. Entrances, Specials, Managers, Actions and Supports use the card name plus a small card-type label. Momentum uses the card name plus its compact Momentum identity. Detailed rules, restrictions, effects, rarity and signature status remain **back-only**.

The studio is self-contained for direct `file://` use, reads chosen images into export-safe browser memory, and exports a flattened WebP to an automatic path under `assets/cards/art/custom/`. No manifest edit is required. The game automatically prefers a finished front when installed and falls back to the existing artwork/generated layout when it is missing. The old Superstar Studio URL now redirects into this one unified editor.

## v0.8.4 — Endgame, submission AI & starter flow

- 0 HP is now a **Critical Exhaustion** state rather than an automatic KO. A wrestler may survive a pin and continue, but cannot retain Control after completing offense at 0 HP.
- Pin pressure is materially stronger in the 0–10% HP critical window while preserving the requirement to actually score a pin or submission.
- CPU pass telemetry records why offense could not be played: no Move in hand, total Momentum, method Momentum, posture, location, stunned, or other legality.
- Finisher and Trademark submissions are always maintained while the controller has a page available to ditch; generic submissions remain strategic.
- Recommended starter decks contain **zero ringside-only Moves**. Those cards remain collectible and custom-deck legal for ringside/Falls Count Anywhere-style builds.
- Starter construction is more offense-forward to reduce dead Control turns without removing tactical counters.
- Charlotte's Momentum package was corrected to better support her Technical/Strike attack flow.
- Counter-attacks and counter-to-counter windows from v0.8.2/v0.8.3 remain fully intact.
- Certification: **257/257 regression tests passing**. Full 24-Superstar audit: **6,912 matches, 0 stalls, 24.09 average turns, 3.47 average loser HP, 112 time-limit draws**. Superstar win-rate range is **43.1%–56.3%** in the seeded matrix.


## v0.8.2 — Counter chains & match pacing

- Offensive Moves used as legal Counters now become real counter-attacks: printed damage/effects resolve if the opponent does not counter them back.
- Counter-to-counter windows recurse through the Move Type system for every qualifying collectible Move, including future cards; pure defensive counters still resolve immediately.
- Added exact regressions for European Uppercut damage and Rhea Ripley receiving a legal response window to counter the counter.
- Rebalanced finishing pressure toward an approximately 25-turn match and approximately 10% loser HP at the finish without changing printed Move damage.
- Strengthened submission resilience so holds require more accumulated pressure and health wear before a tap.
- Added late-match pin pressure plus a hard Turn-50 time-limit draw to prevent pathological endless matches.
- Full 6,912-match AI roster audit: 24.43 average turns, 3.68 average loser HP, 0 stalls, 89 time-limit draws (1.3%).

## v0.8.1 control-flow correction

A successful connected Move now ends the current turn but **retains Control for the attacker**, starts a fresh turn for that same wrestler, and draws one page. Control transfers only on a successful Counter/Auto Counter, an explicit Pass, or a **failed pin** (including a kick-out or pin-escape Special). A successful pin ends the match. Voluntarily releasing a submission continues to keep Control.

This correction materially changes match rhythm: the final 24-Superstar audit is 6,912 matches with 0 stalls, 13.86 average turns, 7.62 average Control changes, 20.8% Move counter rate, and 86.3% pin / 13.7% submission finishes. The current seeded balance range widened to 38.0%-63.4%, so wrestler-specific balance tuning should be revisited after this rules correction rather than treating the prior v0.8.0 tuning as final.


## v0.8.1 — Submission overhaul & premium mobile presentation

Submissions are now a genuine alternative finishing path rather than a rare edge case. Body-part pressure still persists independently across Head / Arm / Back / Leg and maintaining a hold still requires ditching one page, but the tap threshold now scales with the defender's maximum and current HP. Overall match damage therefore softens a wrestler up for a submission without replacing the separate limb-pressure game. CPU decision-making now values existing pressure on the targeted body part, recognizes holds that can force a tap on the next squeeze, and is substantially more willing to maintain Finisher/Trademark submissions. Releasing a hold still keeps Control.

The 24-Superstar, 6,912-match certification now produces **977 submission finishes (14.1%)** and **5,935 pin finishes (85.9%)**, with **0 stalls / 0 draws**. There were 2,326 submission holds connected, 1,574 maintains and 1,349 releases. Submission specialists now meaningfully win by tap-out while pins remain the primary finish. The seeded Superstar win-rate range remains 43.1%–57.3%.

The user interface has been rebuilt into a more image-led premium mobile presentation. The Main Menu uses large Superstar-driven mode tiles and a live Season panel instead of text-heavy boxes. Exhibition, Climb the Ladder and Championship Road each have their own logo treatment, colour language, hero artwork and match banner. Seasons, Challenges, Collection, Booster Vault, Deck Lab and My Legacy/Profile also have distinct visual identities and screen backgrounds. SummerSlam, Hall of Fame and Evolution Collection/Booster screens inherit their own set colours and Superstar hero imagery.

The live match remains deliberately focused: no opponent deck/hand is exposed, the current Play Pile stays central, only the player's hand is shown, and the Match Log remains collapsible. Submission pressure is now visualized per body part in each wrestler HUD with live bars and the current tap threshold. When a hold is active, a dedicated high-urgency submission panel shows the hold name, targeted limb, current pressure, required tap value and available pages to ditch for another squeeze. Match-log entries display card names instead of internal IDs.

A persistent five-button mobile navigation shell (Home / Play / Cards / Packs / Season) now links the progression/browsing screens and automatically highlights the active destination. It is intentionally hidden on the splash screen, starter onboarding and during live matches so it does not consume match space. Responsive rules cover narrow iPhone-sized viewports with no intentional page-level horizontal scrolling.



## v0.7.0 — Seasons

**Seasons** is now a major Main Menu destination. Season 1 — **Legacy Begins** runs from 10 August 2026 to the Season 2 / Survivor Series launch on 28 November 2026, with a live countdown shown in the menu and Season screen.

Season 1 roadmap:

- **10 Aug — Launch:** SummerSlam — Series 1, Hall of Fame — Series 1 and Evolution — Series 1.
- **26 Sep — Worlds Collide:** planned 4-Superstar WWE × AAA subset. Wrestler slots remain unrevealed until the real event card is established.
- **10 Oct — Money in the Bank:** planned 4-Superstar event subset.
- **28 Nov — Season 2 / Survivor Series:** planned 8-Superstar full set plus a fresh Season Road.

The Season Road contains **50 tiers at 100 XP each (5,000 XP total)**. Match wins award **25 XP**, losses/draws award **5 XP**, claimed Daily Challenges award **50 XP**, and claimed Weekly Challenges award **200 XP**. Every reached tier has a booster reward, with larger multi-pack rewards on major milestones including Tiers 25 and 50. Rewards are claimable individually or through **Claim All Available**.

A rolling **24-hour Free Booster** is attached to the local profile. The first pack is available immediately; once claimed, a live timer counts down exactly 24 hours. The reward is drawn from the currently Featured Season 1 sets and is added to the appropriate set's Booster screen. Missing a day does not break a streak or forfeit anything; one free booster simply waits until claimed.

The Season screen also previews the content lifecycle rather than deleting cards: owned cards always remain usable. The Season 2 roadmap currently plans SummerSlam — Series 1 to move from Featured to Vaulted, while Hall of Fame and Evolution move into Returning/Legacy rotation. The actual lifecycle transition is intentionally applied by the future Season 2 content update so an old static build cannot vault content without its replacement set being installed.

Daily/Weekly Challenges remain available as their own screen but now feed the Season XP system directly.


## v0.6.0 — Evolution — Series 1

Evolution is the third full collectible set and expands WWE Legacy to **24 fully interoperable playable Superstars** and **510 collectible cards**. Women and men use the same match engine and can face one another in Exhibition, Climb the Ladder and Championship Road.

**Evolution — Series 1:** 172 collectible cards · 8 Superstars · 141 Moves.

- Rhea Ripley
- Liv Morgan
- Becky Lynch
- Bayley
- Charlotte Flair
- IYO SKY
- Paige
- Stephanie Vaquer

The set contains **53 shared Moves** designed as a broad common offensive/counter pool, plus **11 wrestler-specific Moves per Superstar**. Named Entrances, Signatures, Trademarks and Finishers carry `superstarId` restrictions and can only be used by their linked wrestler. Evolution has its own collection/milestone progress, booster pool, Superstar-card treatment, purple/magenta booster wrapper and card-back presentation.

Climb the Ladder now includes an **Evolution — Series 1** eight-opponent path. Championship Road includes an **Evolution** four-stage branch with Rhea Ripley / Liv Morgan as its championship-final pairing. Any unlocked Superstar can enter those paths, preserving mixed-roster play.

All eight Evolution Superstars have temporary local WebP portraits with provenance in `assets/art/evolution-series-1/SOURCES.md`. The shared artwork resolver gives all **510/510 collectibles** a local image, and Card Art Studio automatically lists the expanded catalogue for progressive replacement with exact action photos.



## v0.5.3 — Card Art Studio

A browser-based artwork preparation tool is included at **`tools/card-art-studio.html`** and is linked from **Profile → Card Art Studio**. It is designed for replacing the temporary card photos without editing card templates or gameplay data.

Workflow:

1. Select any collectible card from the current catalogue (510 in v0.6.0). The studio automatically knows the card ID, set, card type, title, Cost/Damage display and target artwork path.
2. Paste a **direct image URL**, upload/choose an image file, drag-and-drop an image, or paste an image from the clipboard. Google image-result URLs containing an `imgurl` parameter are normalized automatically.
3. Drag the live card preview to reposition the crop. Pinch on touch screens, mouse-wheel on desktop, or use the Zoom / Horizontal / Vertical controls for fine adjustment.
4. Export to WebP at 680×1000 (recommended), 816×1200, or 1020×1500 with adjustable quality. The default is 680×1000 at 82% quality.
5. The output is named from the card ID automatically and targets `assets/cards/art/custom/<card-id>.webp`. The manifest entry is generated automatically.

On desktop browsers supporting the File System Access API, **Connect Project Folder** lets the studio write the WebP directly into the correct project folder and rewrite `js/data/card-art-overrides.js` automatically. On iPhone/Safari and other browsers without direct folder writing, the studio downloads the correctly named WebP and can download an updated `card-art-overrides.js` for replacement in the project.

The preview deliberately shows the real card title/stat overlays, but the exported WebP contains only the cropped image; WWE Legacy continues to draw the reusable collectible-card frame, card name, Cost/Damage and effects side in code.

If a remote image host blocks browser canvas access through CORS, use the same source image via **Upload / choose photo**. Static GitHub Pages cannot bypass a third-party site's CORS rules.


## v0.5.2 — temporary art coverage for every collectible

- Every collectible card now resolves to a real local image file; there are no blank artwork slots in normal play.
- Hall of Fame — Series 1 now has temporary wrestler photos for all eight Superstar cards.
- Wrestler-specific Moves/Entrances inherit that Superstar image until a unique action photo is supplied.
- Generic cards inherit a sourced wrestling-action photo until their final art is supplied.
- `js/data/card-art-overrides.js` remains the one-line replacement layer: add `card-id -> image path` and the final photo replaces the fallback everywhere.
- Temporary photo provenance is recorded in `assets/cards/ART_SOURCES.md`.


## v0.5.1 — collectible card visual template

Cards now use a shared two-sided collectible-card renderer across the live hand, Play Pile, Collection and booster reveals. The **front is artwork-first**: the card image fills the face, the card name sits at the top, and Move cards show **Cost** and **Damage** in a fixed bottom stat bar. Tap the card to flip it and read the full effects/rules on the reverse. In the live hand, flipping no longer plays a card accidentally; a separate **Play** button commits the card only when it is legal.

Superstar cards use set-specific visual treatments so SummerSlam — Series 1, Hall of Fame — Series 1 and Evolution — Series 1 each have distinct collectible identities. Foils layer their visual treatment on top of the same template.

Artwork is decoupled from gameplay through `js/data/card-art-overrides.js`. To replace a sourced photo later, add/change one `card ID -> image path` entry and the replacement automatically appears everywhere that card uses the shared template. See `assets/cards/README.md` for the swap workflow.



## v0.5.0 — WWE Legacy front end and onboarding

The project is now branded **WWE Legacy: Collectible Card Game**. A fresh browser launch opens on a dedicated splash/profile screen rather than dropping directly into match setup.

First-time flow:

1. WWE Legacy splash / local profile entry screen.
2. Champion onboarding with **only CM Punk and Roman Reigns** available.
3. Choosing a Champion creates the local profile and grants that Superstar's connected Superstar card, attached Entrance, five-card playable Lead Off package, and complete 55-card starter deck.
4. The player is taken to the new Main Menu.

Returning saves see the splash screen and then go directly to Main Menu; the starter choice is not repeated.

Main Menu sections are **Play, Seasons, Collection, Boosters, Decks, Challenges, and Profile**. Play opens Exhibition, Climb the Ladder, and Championship Road. A compact WWE Legacy brand button returns to Main Menu from normal screens, and Match Menu contains a Main Menu action during a bout.



## v0.4.6 hotfix — CPU opening Control

Fixed a browser/UI handoff bug where a human-vs-CPU match could freeze on `CPU is thinking...` when the CPU randomly received opening Control. The match setup screen rendered the state but did not invoke the CPU decision driver until after a human action, which is impossible when the CPU owns the first decision.

The CPU turn driver is now UI-independent and regression-tested. When the CPU starts, the browser paints the opening state and then immediately advances CPU Actions/Momentum/Moves until Player 1 has the next decision window.

Clean static browser wrestling/card game engine built from scratch. The original With Authority files are reference material only; this project does not reuse the old mobile recreation code.

## Three collectible sets

The game now has **510 collectible cards across 24 Superstars**. Owned compatible cards from all three sets enter one global deck-building collection.

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

Hall of Fame uses a separate booster pool and separate collection/milestone progress, while its owned cards can still be used in compatible decks alongside SummerSlam and Evolution cards.

### Evolution — Series 1

172 cards · 8 Superstars · 141 Moves

- Rhea Ripley
- Liv Morgan
- Becky Lynch
- Bayley
- Charlotte Flair
- IYO SKY
- Paige
- Stephanie Vaquer

Evolution uses a separate booster pool and progression track. Its 53 shared Moves are legal cross-roster when normal deck requirements are met, while named wrestler identity cards remain restricted to their linked Superstar.


## PRE-MATCH Entrances and Superstar abilities

Entrances resolve automatically **before the bell** from the Superstar card and never occupy a hand or one of the 55 playable deck slots. Each Superstar instead begins with an exact five-card playable Lead Off package: two Momentum pages plus three offensive/counter Moves. Neither wrestler receives a random draw on their first Control turn. A one-time Lead Off rule reduces the Total Momentum requirement of the Superstar's first cost-1/2 Move by 1 (method requirements still apply), and CPU Momentum selection prioritizes an immediately playable opening Move. Random draws begin only after that wrestler has already had their first Control opportunity.

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

Current v0.4.6 baseline: **17.0%** dead-offense passes at 3+ Total Momentum. This remains below the 20% guard while preserving the restored Move-Type counter system and keeping defensive-only reversals out of normal CPU offense.

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
npm run art
```

Current certification: **163/163 automated tests passing** across the **25-Superstar roster**. The suite covers current card-pool legality, all linked Lead Off packages, counter chains, submissions, pins, Managers, Season 1 Final Boss rewards, deck construction, boosters, mobile UI regressions and validation that every one of the **372 active collectibles** resolves to a local image.

### Current tactical balance audit

Run `npm run balance` for the seeded report in `tools/balance-report.txt`. The v0.11.11 audit is **7,500 matches with 0 stalls and 41 time-limit draws**; seeded Superstar win rates range from **43.5% to 59.2%**. A separate full 25-Superstar 10,000-match matrix completed with **0 stalls and 46 draws**.

The AI legal-pass audit also reports **0 voluntary passes while a legal offensive Move is available**. The free-flow audit remains below the 20% dead-offense guard at every audited Momentum threshold.


The project remains a direct static GitHub Pages root.


## v0.4.7 mobile UI pass

- Booster reveals use one large, readable card at a time on phone widths.
- Added Previous / Next Card navigation; Next stays disabled until the current card is revealed.
- Mobile reveal bypasses Safari 3D back-face rendering to prevent mirrored pack artwork appearing through a revealed card.
- Booster controls, tabs, navigation, collection cards, deck builder, ladder/championship, challenges, and match hands are constrained to the mobile viewport with no page-level horizontal overflow.
- Human hands use a two-column phone layout so card text remains readable instead of being clipped in a five-card horizontal strip.


## v0.4.8 mobile width hotfix
- Deck Assistance upgrade suggestions are hard-bounded to the phone viewport.
- Long upgrade reasons wrap at arbitrary break points instead of expanding the page width.
- Upgrade action controls use a two-column mobile grid and collapse to one column on very narrow phones.
- No horizontal page scrolling is required to read or act on upgrade suggestions.

## v0.4.9 mobile match-screen redesign

The live match screen was rebuilt around a compact mobile wrestling layout:

- Both wrestlers share a compact top HUD with portrait, HP, Momentum, submission damage, location/posture, ability status and Control indicator.
- The CPU hand/deck panel is no longer rendered.
- A single central Play Pile shows the most recently played page/counter, including who played it.
- Match prompts and finish actions use a compact command bar; secondary navigation is hidden under Match Menu.
- Only the human player's hand/deck area is shown below the Play Pile.
- Human hand cards use concise at-a-glance stats rather than dumping the full rules string onto every card; complete metadata remains available via the card title/tooltip.
- The Match Log is collapsed by default and stores the full event history in an internal scroll area.
- Mobile HUD/card sizing is tuned specifically for narrow iPhone screens with no opponent-deck clutter.
