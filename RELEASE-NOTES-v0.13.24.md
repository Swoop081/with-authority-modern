# WWE Legacy v0.13.24 — iPhone Interface + Championship Road Campaign Pass

This build consolidates the August 18 iPhone screenshot review into one major presentation/navigation pass and expands Championship Road into WWE Legacy's long-form PvE campaign. Card balance, Superstar HP data, Method limits, authored deck blueprints, Store prices, normal booster rarity weights, Superstar chase odds and release dates are unchanged unless explicitly described below.

## Championship Road — 24-match graphic campaign
- Replaces the old compact four-fight era-tab presentation with one continuous, graphic-heavy road/map.
- Each numbered node is a matchup. Winning unlocks and advances to the next node.
- Season 1 opponent order is locked to 24 matches:
  1. Hulk Hogan
  2. André the Giant
  3. Randy Savage
  4. Ultimate Warrior
  5. CM Punk
  6. Seth Rollins
  7. Roman Reigns
  8. Kevin Owens
  9. IYO SKY
  10. Bayley
  11. Paige
  12. Stephanie Vaquer
  13. Mankind
  14. Kane
  15. The Undertaker
  16. Stone Cold Steve Austin
  17. Cody Rhodes
  18. Oba Femi
  19. Brock Lesnar
  20. Gunther
  21. Charlotte Flair
  22. Rhea Ripley
  23. Liv Morgan
  24. Becky Lynch
- The road is visually divided into six four-match regions: **Golden Era / SummerSlam Part I / Evolution Part I / Attitude Era / SummerSlam Part II / Evolution Part II**.

## Championship Road difficulty
- Championship Road begins on **Easy**.
- Complete the full 24-match Easy Road to unlock **Normal**.
- Complete Normal to unlock **Hard**.
- Complete Hard to unlock **Hardcore**.
- CPU starting HP modifiers:
  - Easy: **-5 HP**
  - Normal: **no change**
  - Hard: **+5 HP**
  - Hardcore: **+10 HP**
- The player's starting/max HP is not modified.
- Each difficulty records its own best-stage/completion state, creating **96 total campaign match clears** for a full four-difficulty completion.
- The MatchEngine now supports a scoped `startingHpBonus` modifier so Hard/Hardcore can increase only the Championship Road CPU's max/current HP without altering card data.

## Championship Road economy safeguard
- The old one-standard-booster-per-win behavior is not multiplied across the new 96-match structure.
- A standard booster is awarded when a player completes each **four-match themed region**.
- Full 24-match completion still awards the existing Championship Pack.
- The existing first-full-Road-clear-with-a-Superstar bonus remains.

## Money in the Bank
- **Climb the Ladder** is retired as a player-facing name and becomes **Money in the Bank** everywhere in the live UI/rules/career presentation.
- Money in the Bank is removed completely from **My Challenges** and moved into **Live Events**.
- Rules remain unchanged: fixed 8-opponent daily field, 3 lives, one life lost per defeat, losing all 3 resets to Level 1 against that day's same field, local-midnight reset, one completion reward.
- Existing internal Ladder IDs/state remain for save compatibility.

## King of the Ring bracket presentation
- Replaces the lower text-results list with an actual Superstar-card tournament bracket.
- Quarterfinals show the eight entrants across a horizontally scrollable left/right bracket.
- Semifinals contract to the four remaining Superstars — two left, two right — on one screen.
- The Final contracts again to the two finalists with a central crown/final focus.
- Winners advance visually and eliminated branches are de-emphasized.
- The KOTR hero is tightened and the Reigning King render is moved higher into the top-right rather than leaving a large empty hero area.
- KOTR rules/reward remain unchanged from v0.13.23: one loss eliminates; champion coronation; choose 1 of 3 released-set boosters; exactly one booster total.

## Season 1 Road redesign
- Replaces the grey stacked tier list with a colourful, graphic vertical **100-tier reward road**.
- Uses large WWE Legacy display typography and stronger purple/cyan/gold Final Boss identity.
- Current tier, claimable rewards and major Final Boss milestones receive distinct presentation.
- The screen **auto-scrolls to the player's current tier** when opened.
- A live **Season 1 end countdown** is shown prominently.
- Reward mechanics and the existing 100-tier reward schedule are unchanged.

## iPhone interface cleanup
- **Home:** Season One tile typography/spacing now matches the established Home command-tile system; ONE retains cyan accent.
- **Header:** PACKS and UP use the approved display style while remaining compact enough for values underneath.
- **Live Events:** tower names use large split titles with category colour — Powerhouse / Collision red, Submission / Specialists green, Legends / Collide gold.
- **Exhibition:** removes the redundant top Superstar render, enlarges Exhibition Showcase branding and strips oversized outer frames from the Superstar selector.
- **My Challenges:** removes Becky Lynch hero art and repeated headings; tightens overview, daily/weekly and set-milestone presentation.
- **Packs:** removes Roman Reigns hero art and repeated Open Packs/Booster Vault wording; empty state and utility stats are compacted.
- **Store:** removes the Iyo Sky hero; Featured Superstars become a two-column vertical grid; UP prices use a bright gold currency treatment; major section headings use the approved font system.
- **My Collection:** removes Roman hero and duplicate Collection headings; stats/switch/search/filter controls are compressed.
- **Card Catalogue:** removes duplicate database/catalogue headings and reduces top spacing so search, filters and card grid arrive sooner.
- **My Legacy:** removes Roman hero and duplicate My Legacy/career copy; Career Record and utility content are pulled higher.

## Compatibility and retained systems
- Profile schema remains **30**.
- Existing pre-v0.13.24 four-match Championship Road active runs are retired safely because they cannot map cleanly onto the new 24-match campaign; historical clears and already-earned rewards remain.
- Existing Money in the Bank/Ladder state remains compatible because internal IDs/state are preserved.
- KOTR reigning King/coronation/reward state remains compatible.
- Superstar chase remains **2% natural / one global 100-miss pity**.
- Secondary Superstar unlocks remain **Superstar + at most 1 Finisher + 1 Trademark + 1 Action**, with no manufactured 60-card secondary deck.
- Actions remain **69 Actions / 0 Special-kind collectible cards**.
- Expanded Achievements/AP/Career Score remains deliberately unimplemented/on hold.

## No balance/data changes
No changes were made to printed card Cost/Damage, Superstar base HP, Method limits, authored 60-page recommended deck blueprints, Store prices, duplicate UP values, normal booster rarity weights, Superstar chase rate, global pity threshold, release dates or artwork asset inventory.
